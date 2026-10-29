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
import type { Program, NewProgram } from '../models/Program';
import type { Repository } from './Repository';

export class FirestoreProgramRepository implements Repository<Program, NewProgram> {
    private readonly programsCollection = collection(db, 'programs');

    async getAll(): Promise<Program[]> {
        const snapshot = await getDocs(query(this.programsCollection, orderBy('name')));
        return snapshot.docs.map((docSnapshot) => ({
            id: docSnapshot.id,
            ...(docSnapshot.data() as NewProgram),
        }));
    }

    subscribe(onData: (programs: Program[]) => void, onError: (error: Error) => void): () => void {
        const programsQuery = query(this.programsCollection, orderBy('name'));
        return onSnapshot(
            programsQuery,
            (snapshot) => {
                onData(
                    snapshot.docs.map((docSnapshot) => ({
                        id: docSnapshot.id,
                        ...(docSnapshot.data() as NewProgram),
                    }))
                );
            },
            onError
        );
    }

    async add(program: NewProgram): Promise<Program> {
        const docRef = await addDoc(this.programsCollection, program);
        return { id: docRef.id, ...program };
    }

    /** Writes a program under a caller-supplied id, so it can mirror a record from another store. */
    set(program: Program): Promise<void> {
        const { id, ...data } = program;
        return setDoc(doc(this.programsCollection, id), data);
    }

    update(id: string, changes: Partial<NewProgram>): Promise<void> {
        return updateDoc(doc(this.programsCollection, id), changes);
    }

    remove(id: string): Promise<void> {
        return deleteDoc(doc(this.programsCollection, id));
    }
}

export const firestoreProgramRepository = new FirestoreProgramRepository();
