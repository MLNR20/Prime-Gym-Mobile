import * as Network from 'expo-network';
import { firestoreProgramRepository } from './FirestoreProgramRepository';
import type { Program, NewProgram } from '../models/Program';
import type { Repository } from './Repository';
import { sqliteProgramRepository } from './SqliteProgramRepository';

/**
 * SQLite stays the source of truth for reads/updates/removes. A newly created program is
 * additionally, best-effort mirrored to Firestore as a cloud backup — a Firestore failure is
 * logged but never blocks the local save. Updates and removals are mirrored the same way, so a removed
 * program isn't restored by the next pull.
 *
 * Before serving reads, any Firestore-only records (e.g. a fresh install restoring from a cloud
 * backup) are pulled down into SQLite first, via insertMissing so local edits are never
 * overwritten. The pull is skipped, not retried,
 * when the device has no internet connection.
 */
export class MirroredProgramRepository implements Repository<Program, NewProgram> {
    private async pullFromFirestore(): Promise<void> {
        try {
            const networkState = await Network.getNetworkStateAsync();
            if (!networkState.isConnected || networkState.isInternetReachable === false) {
                console.warn('Skipping Firestore pull: device is offline');
                return;
            }
            const cloudPrograms = await firestoreProgramRepository.getAll();
            await sqliteProgramRepository.insertMissing(cloudPrograms);
        } catch (error) {
            console.warn('Failed to pull programs from Firestore', error);
        }
    }

    subscribe(onData: (items: Program[]) => void, onError: (error: Error) => void): () => void {
        let cancelled = false;
        let unsubscribeSqlite: (() => void) | null = null;

        this.pullFromFirestore().finally(() => {
            if (!cancelled) {
                unsubscribeSqlite = sqliteProgramRepository.subscribe(onData, onError);
            }
        });

        return () => {
            cancelled = true;
            unsubscribeSqlite?.();
        };
    }

    async getAll(): Promise<Program[]> {
        await this.pullFromFirestore();
        return sqliteProgramRepository.getAll();
    }

    async add(item: NewProgram): Promise<Program> {
        const program = await sqliteProgramRepository.add(item);
        firestoreProgramRepository.set(program).catch((error) => {
            console.warn('Failed to back up new program to Firestore', error);
        });
        return program;
    }

    async update(id: string, changes: Partial<NewProgram>): Promise<void> {
        await sqliteProgramRepository.update(id, changes);
        firestoreProgramRepository.update(id, changes).catch((error) => {
            console.warn('Failed to back up program update to Firestore', error);
        });
    }

    async remove(id: string): Promise<void> {
        await sqliteProgramRepository.remove(id);
        // Mirrored too, otherwise the next Firestore pull would restore the removed program.
        firestoreProgramRepository.remove(id).catch((error) => {
            console.warn('Failed to remove program from Firestore', error);
        });
    }
}

export const mirroredProgramRepository = new MirroredProgramRepository();
