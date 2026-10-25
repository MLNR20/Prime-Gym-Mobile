import * as Network from 'expo-network';
import { firestoreAttendanceRepository } from './FirestoreAttendanceRepository';
import type { AttendanceRecord, NewAttendanceRecord } from '../models/AttendanceRecord';
import type { Repository } from './Repository';
import { sqliteAttendanceRepository } from './SqliteAttendanceRepository';

/**
 * SQLite stays the source of truth for reads. Unlike the other mirrored repositories, updates and
 * removals are mirrored to Firestore as well as creates: an attendance record is routinely edited
 * after it is created (time_out is filled in at check-out), so a create-only backup would hold
 * stale records. Every Firestore write is best-effort — a failure is logged but never blocks the
 * local save.
 *
 * Before serving reads, any Firestore-only records are pulled into SQLite first (see
 * MirroredLockerKeyRepository), skipped when the device is offline.
 */
export class MirroredAttendanceRepository implements Repository<AttendanceRecord, NewAttendanceRecord> {
    private async pullFromFirestore(): Promise<void> {
        try {
            const networkState = await Network.getNetworkStateAsync();
            if (!networkState.isConnected || networkState.isInternetReachable === false) {
                console.warn('Skipping Firestore pull: device is offline');
                return;
            }
            const cloudRecords = await firestoreAttendanceRepository.getAll();
            await sqliteAttendanceRepository.insertMissing(cloudRecords);
        } catch (error) {
            console.warn('Failed to pull attendance records from Firestore', error);
        }
    }

    subscribe(onData: (items: AttendanceRecord[]) => void, onError: (error: Error) => void): () => void {
        let cancelled = false;
        let unsubscribeSqlite: (() => void) | null = null;

        this.pullFromFirestore().finally(() => {
            if (!cancelled) {
                unsubscribeSqlite = sqliteAttendanceRepository.subscribe(onData, onError);
            }
        });

        return () => {
            cancelled = true;
            unsubscribeSqlite?.();
        };
    }

    async getAll(): Promise<AttendanceRecord[]> {
        await this.pullFromFirestore();
        return sqliteAttendanceRepository.getAll();
    }

    async add(item: NewAttendanceRecord): Promise<AttendanceRecord> {
        const record = await sqliteAttendanceRepository.add(item);
        firestoreAttendanceRepository.set(record).catch((error) => {
            console.warn('Failed to back up attendance record to Firestore', error);
        });
        return record;
    }

    async update(id: string, changes: Partial<NewAttendanceRecord>): Promise<void> {
        await sqliteAttendanceRepository.update(id, changes);
        firestoreAttendanceRepository.update(id, changes).catch((error) => {
            console.warn('Failed to mirror attendance update to Firestore', error);
        });
    }

    async remove(id: string): Promise<void> {
        await sqliteAttendanceRepository.remove(id);
        firestoreAttendanceRepository.remove(id).catch((error) => {
            console.warn('Failed to mirror attendance removal to Firestore', error);
        });
    }
}

export const mirroredAttendanceRepository = new MirroredAttendanceRepository();
