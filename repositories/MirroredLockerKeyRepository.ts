import * as Network from 'expo-network';
import { firestoreLockerKeyRepository } from './FirestoreLockerKeyRepository';
import type { LockerKey, NewLockerKey } from '../models/LockerKey';
import type { Repository } from './Repository';
import { sqliteLockerKeyRepository } from './SqliteLockerKeyRepository';

/**
 * SQLite stays the source of truth for reads/updates/removes. A newly created locker key is
 * additionally, best-effort mirrored to Firestore as a cloud backup — a Firestore failure is
 * logged but never blocks the local save.
 *
 * Before serving reads, any Firestore-only records (e.g. a fresh install restoring from a cloud
 * backup) are pulled down into SQLite first, via insertMissing so local edits/removals — which are
 * never mirrored back up to Firestore — are never overwritten. The pull is skipped, not retried,
 * when the device has no internet connection.
 */
export class MirroredLockerKeyRepository implements Repository<LockerKey, NewLockerKey> {
    private async pullFromFirestore(): Promise<void> {
        try {
            const networkState = await Network.getNetworkStateAsync();
            if (!networkState.isConnected || networkState.isInternetReachable === false) {
                console.warn('Skipping Firestore pull: device is offline');
                return;
            }
            const cloudLockerKeys = await firestoreLockerKeyRepository.getAll();
            await sqliteLockerKeyRepository.insertMissing(cloudLockerKeys);
        } catch (error) {
            console.warn('Failed to pull locker keys from Firestore', error);
        }
    }

    subscribe(onData: (items: LockerKey[]) => void, onError: (error: Error) => void): () => void {
        let cancelled = false;
        let unsubscribeSqlite: (() => void) | null = null;

        this.pullFromFirestore().finally(() => {
            if (!cancelled) {
                unsubscribeSqlite = sqliteLockerKeyRepository.subscribe(onData, onError);
            }
        });

        return () => {
            cancelled = true;
            unsubscribeSqlite?.();
        };
    }

    async getAll(): Promise<LockerKey[]> {
        await this.pullFromFirestore();
        return sqliteLockerKeyRepository.getAll();
    }

    async add(item: NewLockerKey): Promise<LockerKey> {
        const lockerKey = await sqliteLockerKeyRepository.add(item);
        firestoreLockerKeyRepository.set(lockerKey).catch((error) => {
            console.warn('Failed to back up new locker key to Firestore', error);
        });
        return lockerKey;
    }

    update(id: string, changes: Partial<NewLockerKey>): Promise<void> {
        return sqliteLockerKeyRepository.update(id, changes);
    }

    remove(id: string): Promise<void> {
        return sqliteLockerKeyRepository.remove(id);
    }
}

export const mirroredLockerKeyRepository = new MirroredLockerKeyRepository();
