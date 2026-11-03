import AsyncStorage from '@react-native-async-storage/async-storage';
import { nowInPhilippineTime } from '../utils/dateTime';
import type { FirestoreCollection } from './FirestoreCollection';
import type { Repository } from './Repository';
import type { SqliteRepository } from './SqliteRepository';

/**
 * Keeps this phone's SQLite table and a Firestore collection in step, in both directions.
 *
 * - SQLite is what the screens read, so the app is instant and works offline.
 * - Every change is saved to SQLite first, then sent to Firestore in the background.
 * - sync() compares both sides record by record and the newest `date_updated` wins:
 *     only in the cloud            -> copy it down      (a new record from another phone)
 *     newer in the cloud           -> overwrite locally (another phone edited it)
 *     newer (or only) locally      -> send it up        (edited or created while offline)
 *     removed (tombstone) in cloud -> delete it locally (another phone removed it)
 * - Removals leave a tombstone in the cloud; a removal made offline is remembered on the phone until
 *   it has been delivered, so it is never "un-removed" by the next sync.
 *
 * Two phones editing the same record at the same moment: the later edit replaces the whole record.
 */

const MIN_SYNC_GAP_MS = 15_000;

type Syncable = { id: string; date_updated: string };

const registry: { sync(force: boolean): Promise<void> }[] = [];

/** Syncs every shared table. Called on launch, on returning to the app and on a timer (see useCloudSync). */
export async function syncAllRepositories(force = false): Promise<void> {
    await Promise.all(registry.map((repository) => repository.sync(force)));
}

// Unparseable timestamps count as "very old" so a good record always beats a broken one.
function time(isoTimestamp: string): number {
    const parsed = Date.parse(isoTimestamp);
    return Number.isNaN(parsed) ? 0 : parsed;
}

export class SyncedRepository<T extends Syncable, TNew extends Record<string, unknown> & { date_updated: string }>
    implements Repository<T, TNew>
{
    private running: Promise<void> | null = null;
    private lastSync = 0;
    private pendingQueue: Promise<unknown> = Promise.resolve();

    constructor(
        private readonly local: SqliteRepository<T, TNew>,
        private readonly cloud: FirestoreCollection<T>,
        private readonly name: string
    ) {
        registry.push(this);
    }

    subscribe(onData: (items: T[]) => void, onError: (error: Error) => void): () => void {
        // Screens show the local data straight away; anything new from the cloud arrives as a second update.
        this.sync(false);
        return this.local.subscribe(onData, onError);
    }

    getAll(): Promise<T[]> {
        return this.local.getAll();
    }

    async add(item: TNew): Promise<T> {
        const record = await this.local.add(item);
        this.push(record);
        return record;
    }

    async update(id: string, changes: Partial<TNew>): Promise<void> {
        // The timestamp is what decides who wins a sync, so every edit must move it forward.
        await this.local.update(id, { date_updated: nowInPhilippineTime(), ...changes } as Partial<TNew>);
        const record = await this.local.getById(id);
        if (record) this.push(record);
    }

    async remove(id: string): Promise<void> {
        const stamp = nowInPhilippineTime();
        await this.updatePending((ids) => ids.add(id));
        await this.local.remove(id);
        this.cloud
            .markRemoved(id, stamp)
            .then(() => this.updatePending((ids) => ids.delete(id)))
            .catch((error) => console.warn(`[sync:${this.name}] removal will be retried`, error));
    }

    /** Runs one two-way sync. Skipped if one is running, or (unless forced) if one just finished. */
    sync(force = false): Promise<void> {
        if (this.running) return this.running;
        if (!force && Date.now() - this.lastSync < MIN_SYNC_GAP_MS) return Promise.resolve();
        this.running = this.reconcile()
            .catch((error) => console.warn(`[sync:${this.name}] skipped`, error))
            .finally(() => {
                this.running = null;
                this.lastSync = Date.now();
            });
        return this.running;
    }

    private push(record: T) {
        // Best effort: if this fails (offline), the next sync sees the record is newer here and sends it.
        this.cloud.set(record).catch((error) => console.warn(`[sync:${this.name}] will retry`, error));
    }

    private async reconcile(): Promise<void> {
        // 1. Deliver removals that couldn't be sent earlier (throws when offline, which ends the sync).
        const stamp = nowInPhilippineTime();
        for (const id of await this.loadPending()) {
            await this.cloud.markRemoved(id, stamp);
            await this.updatePending((ids) => ids.delete(id));
        }

        // 2. Compare. The local read comes after the network call so it is as fresh as possible.
        const cloud = await this.cloud.getAll();
        const local = await this.local.getAll();
        // A record removed on this phone while the comparison was under way must not be copied back down.
        const removing = new Set(await this.loadPending());
        const localById = new Map(local.map((item) => [item.id, item]));
        const cloudIds = new Set(cloud.live.map((item) => item.id));
        const removedIds = new Set(cloud.removed.map((item) => item.id));

        const toPull: T[] = [];
        const toPush: T[] = [];
        for (const theirs of cloud.live) {
            if (removing.has(theirs.id)) continue;
            const mine = localById.get(theirs.id);
            if (!mine || time(theirs.date_updated) > time(mine.date_updated)) toPull.push(theirs);
            else if (time(mine.date_updated) > time(theirs.date_updated)) toPush.push(mine);
        }
        for (const mine of local) {
            if (!cloudIds.has(mine.id) && !removedIds.has(mine.id)) toPush.push(mine);
        }
        const toDelete = cloud.removed.map((item) => item.id).filter((id) => localById.has(id));

        // 3. Apply.
        await this.local.upsertMany(toPull);
        await this.local.removeMany(toDelete);
        await Promise.all(toPush.map((record) => this.cloud.set(record)));
    }

    private get pendingKey() {
        return `sync-removed:${this.name}`;
    }

    private async loadPending(): Promise<string[]> {
        try {
            return JSON.parse((await AsyncStorage.getItem(this.pendingKey)) ?? '[]');
        } catch {
            return [];
        }
    }

    // Changes to the remembered removals run one at a time so two quick removals can't overwrite each other.
    private updatePending(change: (ids: Set<string>) => void): Promise<void> {
        const next = this.pendingQueue.then(async () => {
            const ids = new Set(await this.loadPending());
            change(ids);
            try {
                await AsyncStorage.setItem(this.pendingKey, JSON.stringify([...ids]));
            } catch {
                // Storage unavailable: worst case a removal made while offline is restored by the next sync.
            }
        });
        this.pendingQueue = next.catch(() => undefined);
        return next;
    }
}
