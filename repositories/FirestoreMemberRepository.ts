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
import type { Member, NewMember } from '../models/Member';
import type { Repository } from './Repository';

export class FirestoreMemberRepository implements Repository<Member, NewMember> {
    private readonly membersCollection = collection(db, 'members');

    async getAll(): Promise<Member[]> {
        const snapshot = await getDocs(query(this.membersCollection, orderBy('last_name')));
        return snapshot.docs.map((docSnapshot) => ({
            id: docSnapshot.id,
            ...(docSnapshot.data() as NewMember),
        }));
    }

    subscribe(onData: (members: Member[]) => void, onError: (error: Error) => void): () => void {
        const membersQuery = query(this.membersCollection, orderBy('last_name'));
        return onSnapshot(
            membersQuery,
            (snapshot) => {
                onData(
                    snapshot.docs.map((docSnapshot) => ({
                        id: docSnapshot.id,
                        ...(docSnapshot.data() as NewMember),
                    }))
                );
            },
            onError
        );
    }

    async add(member: NewMember): Promise<Member> {
        const docRef = await addDoc(this.membersCollection, member);
        return { id: docRef.id, ...member };
    }

    /** Writes a member under a caller-supplied id, so it can mirror a record from another store. */
    set(member: Member): Promise<void> {
        const { id, ...data } = member;
        return setDoc(doc(this.membersCollection, id), data);
    }

    update(id: string, changes: Partial<NewMember>): Promise<void> {
        return updateDoc(doc(this.membersCollection, id), changes);
    }

    remove(id: string): Promise<void> {
        return deleteDoc(doc(this.membersCollection, id));
    }
}

export const firestoreMemberRepository = new FirestoreMemberRepository();
