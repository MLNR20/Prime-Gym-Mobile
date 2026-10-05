/**
 * Data-access contract for the Model layer. Both the Firestore-backed and SQLite-backed
 * repositories implement this so a ViewModel can depend on the interface only and stay
 * agnostic of which backend is currently active (see repositories/activeRepositories.ts).
 */
export interface Repository<T extends { id: string }, TNew> {
    /** Push-based read: calls onData immediately and again on every change, until unsubscribed. */
    subscribe(onData: (items: T[]) => void, onError: (error: Error) => void): () => void;
    getAll(): Promise<T[]>;
    add(item: TNew): Promise<T>;
    update(id: string, changes: Partial<TNew>): Promise<void>;
    remove(id: string): Promise<void>;
}
