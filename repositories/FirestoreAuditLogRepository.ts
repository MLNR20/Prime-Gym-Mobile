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
import type { AuditLog, NewAuditLog } from '../models/AuditLog';
import type { Repository } from './Repository';

export class FirestoreAuditLogRepository implements Repository<AuditLog, NewAuditLog> {
    private readonly auditLogsCollection = collection(db, 'audit_logs');

    async getAll(): Promise<AuditLog[]> {
        const snapshot = await getDocs(query(this.auditLogsCollection, orderBy('date_created', 'desc')));
        return snapshot.docs.map((docSnapshot) => ({
            id: docSnapshot.id,
            ...(docSnapshot.data() as NewAuditLog),
        }));
    }

    subscribe(onData: (auditLogs: AuditLog[]) => void, onError: (error: Error) => void): () => void {
        const auditLogsQuery = query(this.auditLogsCollection, orderBy('date_created', 'desc'));
        return onSnapshot(
            auditLogsQuery,
            (snapshot) => {
                onData(
                    snapshot.docs.map((docSnapshot) => ({
                        id: docSnapshot.id,
                        ...(docSnapshot.data() as NewAuditLog),
                    }))
                );
            },
            onError
        );
    }

    async add(auditLog: NewAuditLog): Promise<AuditLog> {
        const docRef = await addDoc(this.auditLogsCollection, auditLog);
        return { id: docRef.id, ...auditLog };
    }

    /** Writes an audit log under a caller-supplied id, so it can mirror a record from another store. */
    set(auditLog: AuditLog): Promise<void> {
        const { id, ...data } = auditLog;
        return setDoc(doc(this.auditLogsCollection, id), data);
    }

    update(id: string, changes: Partial<NewAuditLog>): Promise<void> {
        return updateDoc(doc(this.auditLogsCollection, id), changes);
    }

    remove(id: string): Promise<void> {
        return deleteDoc(doc(this.auditLogsCollection, id));
    }
}

export const firestoreAuditLogRepository = new FirestoreAuditLogRepository();
