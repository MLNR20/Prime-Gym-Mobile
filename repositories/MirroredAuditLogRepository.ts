import * as Network from 'expo-network';
import { firestoreAuditLogRepository } from './FirestoreAuditLogRepository';
import type { AuditLog, NewAuditLog } from '../models/AuditLog';
import type { Repository } from './Repository';
import { sqliteAuditLogRepository } from './SqliteAuditLogRepository';

/**
 * SQLite stays the source of truth for reads/updates/removes. A newly created audit log is
 * additionally, best-effort mirrored to Firestore as a cloud backup — a Firestore failure is
 * logged but never blocks the local save.
 *
 * Before serving reads, any Firestore-only records (e.g. a fresh install restoring from a cloud
 * backup) are pulled down into SQLite first, via insertMissing so local edits/removals — which are
 * never mirrored back up to Firestore — are never overwritten. The pull is skipped, not retried,
 * when the device has no internet connection.
 */
export class MirroredAuditLogRepository implements Repository<AuditLog, NewAuditLog> {
    private async pullFromFirestore(): Promise<void> {
        try {
            const networkState = await Network.getNetworkStateAsync();
            if (!networkState.isConnected || networkState.isInternetReachable === false) {
                console.warn('Skipping Firestore pull: device is offline');
                return;
            }
            const cloudAuditLogs = await firestoreAuditLogRepository.getAll();
            await sqliteAuditLogRepository.insertMissing(cloudAuditLogs);
        } catch (error) {
            console.warn('Failed to pull audit logs from Firestore', error);
        }
    }

    subscribe(onData: (items: AuditLog[]) => void, onError: (error: Error) => void): () => void {
        let cancelled = false;
        let unsubscribeSqlite: (() => void) | null = null;

        this.pullFromFirestore().finally(() => {
            if (!cancelled) {
                unsubscribeSqlite = sqliteAuditLogRepository.subscribe(onData, onError);
            }
        });

        return () => {
            cancelled = true;
            unsubscribeSqlite?.();
        };
    }

    async getAll(): Promise<AuditLog[]> {
        await this.pullFromFirestore();
        return sqliteAuditLogRepository.getAll();
    }

    async add(item: NewAuditLog): Promise<AuditLog> {
        const auditLog = await sqliteAuditLogRepository.add(item);
        firestoreAuditLogRepository.set(auditLog).catch((error) => {
            console.warn('Failed to back up new audit log to Firestore', error);
        });
        return auditLog;
    }

    update(id: string, changes: Partial<NewAuditLog>): Promise<void> {
        return sqliteAuditLogRepository.update(id, changes);
    }

    remove(id: string): Promise<void> {
        return sqliteAuditLogRepository.remove(id);
    }
}

export const mirroredAuditLogRepository = new MirroredAuditLogRepository();
