import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    setDoc,
    updateDoc,
} from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import type { Exercise, NewExercise } from '../models/Exercise';
import type { Repository } from './Repository';

export class FirestoreExerciseRepository implements Repository<Exercise, NewExercise> {
    private readonly exercisesCollection = collection(db, 'exercises');

    async getAll(): Promise<Exercise[]> {
        const snapshot = await getDocs(query(this.exercisesCollection, orderBy('name')));
        return snapshot.docs.map((docSnapshot) => ({
            id: docSnapshot.id,
            ...(docSnapshot.data() as NewExercise),
        }));
    }

    subscribe(onData: (exercises: Exercise[]) => void, onError: (error: Error) => void): () => void {
        const exercisesQuery = query(this.exercisesCollection, orderBy('name'));
        return onSnapshot(
            exercisesQuery,
            (snapshot) => {
                onData(
                    snapshot.docs.map((docSnapshot) => ({
                        id: docSnapshot.id,
                        ...(docSnapshot.data() as NewExercise),
                    }))
                );
            },
            onError
        );
    }

    async add(exercise: NewExercise): Promise<Exercise> {
        const docRef = await addDoc(this.exercisesCollection, exercise);
        return { id: docRef.id, ...exercise };
    }

    /** Writes a exercise under a caller-supplied id, so it can mirror a record from another store. */
    set(exercise: Exercise): Promise<void> {
        const { id, ...data } = exercise;
        return setDoc(doc(this.exercisesCollection, id), data);
    }

    update(id: string, changes: Partial<NewExercise>): Promise<void> {
        return updateDoc(doc(this.exercisesCollection, id), changes);
    }

    remove(id: string): Promise<void> {
        return deleteDoc(doc(this.exercisesCollection, id));
    }
}

export const firestoreExerciseRepository = new FirestoreExerciseRepository();
