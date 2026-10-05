import type { SQLiteDatabase } from 'expo-sqlite';
import { generateId } from '../utils/generateId';
import type { Repository } from './Repository';

/**
 * Generic Repository<T> backed by a single SQLite table. expo-sqlite has no live-query
 * mechanism, so `subscribe` is approximated by re-running getAll() after every local write and
 * pushing the result to listeners — good enough for a single-device app, unlike Firestore's
 * true server-pushed snapshots.
 */
export class SqliteRepository<T extends { id: string }, TNew extends Record<string, unknown>>
    implements Repository<T, TNew>
{
    private listeners = new Set<() => void>();
    // expo-sqlite's native module crashes ("NativeDatabase.prepareAsync ... NullPointerException")
    // when two statements run concurrently on the same connection. Screens mount in parallel (tab
    // navigators keep every tab alive) and each subscribes on first render, so every call is
    // funneled through this queue to run one statement at a time on the shared connection.
    private queue: Promise<unknown> = Promise.resolve();

    constructor(
        private readonly dbPromise: Promise<SQLiteDatabase>,
        private readonly table: string,
        private readonly fromRow: (row: Record<string, unknown>) => T,
        private readonly orderBy: string = 'id'
    ) {}

    /** SQLite has no boolean column type, so booleans are bound as 0/1. */
    private toBindValue(value: unknown): string | number | null {
        if (typeof value === 'boolean') return value ? 1 : 0;
        return value as string | number | null;
    }

    private runExclusive<R>(task: (db: SQLiteDatabase) => Promise<R>): Promise<R> {
        const result = this.queue.then(() => this.dbPromise.then(task));
        this.queue = result.catch(() => undefined);
        return result;
    }

    async getAll(): Promise<T[]> {
        const rows = await this.runExclusive((db) =>
            db.getAllAsync<Record<string, unknown>>(`SELECT * FROM ${this.table} ORDER BY ${this.orderBy}`)
        );
        return rows.map(this.fromRow);
    }

    subscribe(onData: (items: T[]) => void, onError: (error: Error) => void): () => void {
        let cancelled = false;
        const notify = () => {
            this.getAll()
                .then((items) => {
                    if (!cancelled) onData(items);
                })
                .catch(onError);
        };
        this.listeners.add(notify);
        notify();
        return () => {
            cancelled = true;
            this.listeners.delete(notify);
        };
    }

    async add(item: TNew): Promise<T> {
        const id = generateId();
        const columns = Object.keys(item);
        const placeholders = columns.map(() => '?').join(', ');
        await this.runExclusive((db) =>
            db.runAsync(
                `INSERT INTO ${this.table} (id, ${columns.join(', ')}) VALUES (?, ${placeholders})`,
                id,
                ...columns.map((column) => this.toBindValue(item[column]))
            )
        );
        this.notifyAll();
        return this.fromRow({ id, ...item });
    }

    async update(id: string, changes: Partial<TNew>): Promise<void> {
        const columns = Object.keys(changes);
        if (columns.length === 0) return;
        const assignments = columns.map((column) => `${column} = ?`).join(', ');
        await this.runExclusive((db) =>
            db.runAsync(
                `UPDATE ${this.table} SET ${assignments} WHERE id = ?`,
                ...columns.map((column) => this.toBindValue(changes[column])),
                id
            )
        );
        this.notifyAll();
    }

    async remove(id: string): Promise<void> {
        await this.runExclusive((db) => db.runAsync(`DELETE FROM ${this.table} WHERE id = ?`, id));
        this.notifyAll();
    }

    /**
     * Inserts each item under its own id, skipping any id that already exists locally. Used to pull
     * in cloud-only records (e.g. a fresh install restoring from a Firestore backup) without
     * clobbering local edits or removals, which are never mirrored back up to Firestore.
     */
    async insertMissing(items: T[]): Promise<void> {
        if (items.length === 0) return;
        await this.runExclusive(async (db) => {
            for (const item of items) {
                const columns = Object.keys(item).filter((column) => column !== 'id');
                const placeholders = columns.map(() => '?').join(', ');
                await db.runAsync(
                    `INSERT OR IGNORE INTO ${this.table} (id, ${columns.join(', ')}) VALUES (?, ${placeholders})`,
                    item.id,
                    ...columns.map((column) => this.toBindValue((item as Record<string, unknown>)[column]))
                );
            }
        });
        this.notifyAll();
    }

    private notifyAll() {
        this.listeners.forEach((listener) => listener());
    }
}
