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
import type { LockerKey, NewLockerKey } from '../models/LockerKey';
import type { Repository } from './Repository';

export class FirestoreLockerKeyRepository implements Repository<LockerKey, NewLockerKey> {
    private readonly lockerKeysCollection = collection(db, 'locker_keys');

    async getAll(): Promise<LockerKey[]> {
        const snapshot = await getDocs(query(this.lockerKeysCollection, orderBy('locker_number')));
        return snapshot.docs.map((docSnapshot) => ({
            id: docSnapshot.id,
            ...(docSnapshot.data() as NewLockerKey),
        }));
    }

    subscribe(onData: (lockerKeys: LockerKey[]) => void, onError: (error: Error) => void): () => void {
        const lockerKeysQuery = query(this.lockerKeysCollection, orderBy('locker_number'));
        return onSnapshot(
            lockerKeysQuery,
            (snapshot) => {
                onData(
                    snapshot.docs.map((docSnapshot) => ({
                        id: docSnapshot.id,
                        ...(docSnapshot.data() as NewLockerKey),
                    }))
                );
            },
            onError
        );
    }

    async add(lockerKey: NewLockerKey): Promise<LockerKey> {
        const docRef = await addDoc(this.lockerKeysCollection, lockerKey);
        return { id: docRef.id, ...lockerKey };
    }

    /** Writes a locker key under a caller-supplied id, so it can mirror a record from another store. */
    set(lockerKey: LockerKey): Promise<void> {
        const { id, ...data } = lockerKey;
        return setDoc(doc(this.lockerKeysCollection, id), data);
    }

    update(id: string, changes: Partial<NewLockerKey>): Promise<void> {
        return updateDoc(doc(this.lockerKeysCollection, id), changes);
    }

    remove(id: string): Promise<void> {
        return deleteDoc(doc(this.lockerKeysCollection, id));
    }
}

export const firestoreLockerKeyRepository = new FirestoreLockerKeyRepository();
