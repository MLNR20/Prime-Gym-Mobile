import * as Network from 'expo-network';
import { firestoreExerciseRepository } from './FirestoreExerciseRepository';
import type { Exercise, NewExercise } from '../models/Exercise';
import type { Repository } from './Repository';
import { sqliteExerciseRepository } from './SqliteExerciseRepository';

/**
 * SQLite stays the source of truth for reads/updates/removes. A newly created exercise is
 * additionally, best-effort mirrored to Firestore as a cloud backup — a Firestore failure is
 * logged but never blocks the local save. Updates and removals are mirrored the same way, so a removed
 * exercise isn't restored by the next pull.
 *
 * Before serving reads, any Firestore-only records (e.g. a fresh install restoring from a cloud
 * backup) are pulled down into SQLite first, via insertMissing so local edits are never
 * overwritten. The pull is skipped, not retried,
 * when the device has no internet connection.
 */
export class MirroredExerciseRepository implements Repository<Exercise, NewExercise> {
    private async pullFromFirestore(): Promise<void> {
        try {
            const networkState = await Network.getNetworkStateAsync();
            if (!networkState.isConnected || networkState.isInternetReachable === false) {
                console.warn('Skipping Firestore pull: device is offline');
                return;
            }
            const cloudExercises = await firestoreExerciseRepository.getAll();
            await sqliteExerciseRepository.insertMissing(cloudExercises);
        } catch (error) {
            console.warn('Failed to pull exercises from Firestore', error);
        }
    }

    subscribe(onData: (items: Exercise[]) => void, onError: (error: Error) => void): () => void {
        let cancelled = false;
        let unsubscribeSqlite: (() => void) | null = null;

        this.pullFromFirestore().finally(() => {
            if (!cancelled) {
                unsubscribeSqlite = sqliteExerciseRepository.subscribe(onData, onError);
            }
        });

        return () => {
            cancelled = true;
            unsubscribeSqlite?.();
        };
    }

    async getAll(): Promise<Exercise[]> {
        await this.pullFromFirestore();
        return sqliteExerciseRepository.getAll();
    }

    async add(item: NewExercise): Promise<Exercise> {
        const exercise = await sqliteExerciseRepository.add(item);
        firestoreExerciseRepository.set(exercise).catch((error) => {
            console.warn('Failed to back up new exercise to Firestore', error);
        });
        return exercise;
    }

    async update(id: string, changes: Partial<NewExercise>): Promise<void> {
        await sqliteExerciseRepository.update(id, changes);
        firestoreExerciseRepository.update(id, changes).catch((error) => {
            console.warn('Failed to back up exercise update to Firestore', error);
        });
    }

    async remove(id: string): Promise<void> {
        await sqliteExerciseRepository.remove(id);
        // Mirrored too, otherwise the next Firestore pull would restore the removed exercise.
        firestoreExerciseRepository.remove(id).catch((error) => {
            console.warn('Failed to remove exercise from Firestore', error);
        });
    }
}

export const mirroredExerciseRepository = new MirroredExerciseRepository();
