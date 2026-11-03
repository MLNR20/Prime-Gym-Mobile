import { collection, doc, getDocs, setDoc, type CollectionReference, type DocumentData } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

export type CloudSnapshot<T> = {
    /** Records that exist in the cloud. */
    live: T[];
    /** Records that were removed (see markRemoved). */
    removed: { id: string; date_updated: string }[];
};

/**
 * One Firestore collection holding the records of one table. Records are never really deleted from
 * the cloud: a removal leaves a small "tombstone" document (`_removed: true`) so that other devices
 * learn about it the next time they sync, instead of mistaking the gap for a record they haven't
 * uploaded yet.
 */
export class FirestoreCollection<T extends { id: string; date_updated: string }> {
    private readonly ref: CollectionReference<DocumentData>;

    constructor(name: string) {
        this.ref = collection(db, name);
    }

    async getAll(): Promise<CloudSnapshot<T>> {
        const snapshot = await getDocs(this.ref);
        const result: CloudSnapshot<T> = { live: [], removed: [] };
        for (const docSnapshot of snapshot.docs) {
            const { _removed, ...data } = docSnapshot.data();
            if (_removed) {
                result.removed.push({ id: docSnapshot.id, date_updated: String(data.date_updated ?? '') });
            } else {
                result.live.push({ ...data, id: docSnapshot.id } as T);
            }
        }
        return result;
    }

    /** Writes the whole record under its own id (creating it, or replacing the cloud copy). */
    set(item: T): Promise<void> {
        const { id, ...data } = item;
        return setDoc(doc(this.ref, id), data);
    }

    /** Replaces the record with a tombstone so every device eventually drops it. */
    markRemoved(id: string, dateUpdated: string): Promise<void> {
        return setDoc(doc(this.ref, id), { _removed: true, date_updated: dateUpdated });
    }
}
