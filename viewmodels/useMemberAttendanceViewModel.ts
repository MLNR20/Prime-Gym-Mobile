import { useEffect, useMemo, useState } from 'react';
import type { AttendanceRecord } from '../models/AttendanceRecord';
import { attendanceRepository } from '../repositories/activeRepositories';

/** A member's check-ins: how many visits, the latest one, and whether they're still checked in. */
export function useMemberAttendanceViewModel(memberId: string) {
    const [records, setRecords] = useState<AttendanceRecord[]>([]);

    useEffect(() => {
        const unsubscribe = attendanceRepository.subscribe(setRecords, (err) => console.warn('Failed to load attendance', err));
        return unsubscribe;
    }, []);

    return useMemo(() => {
        const own = records.filter((record) => record.member_id === memberId).sort((a, b) => b.time_in.localeCompare(a.time_in));
        return {
            visitCount: own.length,
            lastTimeIn: own[0]?.time_in ?? '',
            checkedIn: own.some((record) => !record.time_out),
        };
    }, [records, memberId]);
}
