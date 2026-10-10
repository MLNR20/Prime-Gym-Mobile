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
import type { Contact, NewContact } from '../models/Contact';
import type { Repository } from './Repository';

export class FirestoreContactRepository implements Repository<Contact, NewContact> {
    private readonly contactsCollection = collection(db, 'contacts');

    async getAll(): Promise<Contact[]> {
        const snapshot = await getDocs(query(this.contactsCollection, orderBy('name')));
        return snapshot.docs.map((docSnapshot) => ({
            id: docSnapshot.id,
            ...(docSnapshot.data() as NewContact),
        }));
    }

    subscribe(onData: (contacts: Contact[]) => void, onError: (error: Error) => void): () => void {
        const contactsQuery = query(this.contactsCollection, orderBy('name'));
        return onSnapshot(
            contactsQuery,
            (snapshot) => {
                onData(
                    snapshot.docs.map((docSnapshot) => ({
                        id: docSnapshot.id,
                        ...(docSnapshot.data() as NewContact),
                    }))
                );
            },
            onError
        );
    }

    async add(contact: NewContact): Promise<Contact> {
        const docRef = await addDoc(this.contactsCollection, contact);
        return { id: docRef.id, ...contact };
    }

    /** Writes a contact under a caller-supplied id, so it can mirror a record from another store. */
    set(contact: Contact): Promise<void> {
        const { id, ...data } = contact;
        return setDoc(doc(this.contactsCollection, id), data);
    }

    update(id: string, changes: Partial<NewContact>): Promise<void> {
        return updateDoc(doc(this.contactsCollection, id), changes);
    }

    remove(id: string): Promise<void> {
        return deleteDoc(doc(this.contactsCollection, id));
    }
}

export const firestoreContactRepository = new FirestoreContactRepository();
