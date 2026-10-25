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
import type { AttendanceRecord, NewAttendanceRecord } from '../models/AttendanceRecord';
import type { Repository } from './Repository';

export class FirestoreAttendanceRepository implements Repository<AttendanceRecord, NewAttendanceRecord> {
    private readonly attendanceCollection = collection(db, 'attendance_records');

    async getAll(): Promise<AttendanceRecord[]> {
        const snapshot = await getDocs(query(this.attendanceCollection, orderBy('time_in', 'desc')));
        return snapshot.docs.map((docSnapshot) => ({
            id: docSnapshot.id,
            ...(docSnapshot.data() as NewAttendanceRecord),
        }));
    }

    subscribe(onData: (records: AttendanceRecord[]) => void, onError: (error: Error) => void): () => void {
        const attendanceQuery = query(this.attendanceCollection, orderBy('time_in', 'desc'));
        return onSnapshot(
            attendanceQuery,
            (snapshot) => {
                onData(
                    snapshot.docs.map((docSnapshot) => ({
                        id: docSnapshot.id,
                        ...(docSnapshot.data() as NewAttendanceRecord),
                    }))
                );
            },
            onError
        );
    }

    async add(record: NewAttendanceRecord): Promise<AttendanceRecord> {
        const docRef = await addDoc(this.attendanceCollection, record);
        return { id: docRef.id, ...record };
    }

    /** Writes a record under a caller-supplied id, so it can mirror a record from another store. */
    set(record: AttendanceRecord): Promise<void> {
        const { id, ...data } = record;
        return setDoc(doc(this.attendanceCollection, id), data);
    }

    update(id: string, changes: Partial<NewAttendanceRecord>): Promise<void> {
        return updateDoc(doc(this.attendanceCollection, id), changes);
    }

    remove(id: string): Promise<void> {
        return deleteDoc(doc(this.attendanceCollection, id));
    }
}

export const firestoreAttendanceRepository = new FirestoreAttendanceRepository();
