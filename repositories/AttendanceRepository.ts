import { collection, deleteDoc, doc, onSnapshot, query, setDoc, where } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

const attendanceCollection = collection(db, 'attendance');

/** One record per member per day, keyed as `${memberId}_${date}` so check-ins are idempotent. */
function recordId(memberId: string, date: string) {
    return `${memberId}_${date}`;
}

export function subscribeToAttendanceForDate(
    date: string,
    onData: (presentMemberIds: Set<string>) => void,
    onError: (error: Error) => void
) {
    const attendanceQuery = query(attendanceCollection, where('date', '==', date));
    return onSnapshot(
        attendanceQuery,
        (snapshot) => {
            const presentMemberIds = new Set(
                snapshot.docs.map((docSnapshot) => docSnapshot.data().memberId as string)
            );
            onData(presentMemberIds);
        },
        onError
    );
}

export function checkIn(memberId: string, date: string) {
    return setDoc(doc(attendanceCollection, recordId(memberId, date)), {
        memberId,
        date,
        checkedInAt: Date.now(),
    });
}

export function checkOut(memberId: string, date: string) {
    return deleteDoc(doc(attendanceCollection, recordId(memberId, date)));
}
