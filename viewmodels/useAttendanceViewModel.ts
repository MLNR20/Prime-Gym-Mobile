import { useEffect, useMemo, useState } from 'react';
import type { AttendanceFormValues } from '../components/AttendanceForm';
import type { AttendanceRow } from '../components/AttendanceListCard';
import type { AttendanceRecord } from '../models/AttendanceRecord';
import type { LockerKey } from '../models/LockerKey';
import type { Member } from '../models/Member';
import { attendanceRepository, lockerKeyRepository, memberRepository } from '../repositories/activeRepositories';
import { logAudit } from '../utils/auditLog';
import { nowInPhilippineTime } from '../utils/dateTime';

function memberName(member: Member | undefined) {
    return member ? `${member.first_name} ${member.last_name}` : 'Unknown member';
}

function lockerLabel(lockerKey: LockerKey | undefined) {
    return lockerKey ? `Locker ${lockerKey.locker_number}` : 'Unknown locker';
}

export function useAttendanceViewModel() {
    const [records, setRecords] = useState<AttendanceRecord[]>([]);
    const [members, setMembers] = useState<Member[]>([]);
    const [lockerKeys, setLockerKeys] = useState<LockerKey[]>([]);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);

    useEffect(() => {
        const onError = (err: Error) => {
            setError(err.message);
            setLoading(false);
        };
        const unsubscribeRecords = attendanceRepository.subscribe((data) => {
            setRecords(data);
            setLoading(false);
        }, onError);
        const unsubscribeMembers = memberRepository.subscribe(setMembers, onError);
        const unsubscribeLockerKeys = lockerKeyRepository.subscribe(setLockerKeys, onError);
        return () => {
            unsubscribeRecords();
            unsubscribeMembers();
            unsubscribeLockerKeys();
        };
    }, []);

    const rows = useMemo<AttendanceRow[]>(() => {
        const membersById = new Map(members.map((member) => [member.id, member]));
        const lockerKeysById = new Map(lockerKeys.map((lockerKey) => [lockerKey.id, lockerKey]));
        return records.map((record) => ({
            ...record,
            memberName: memberName(membersById.get(record.member_id)),
            lockerLabel: lockerLabel(lockerKeysById.get(record.locker_key_id)),
        }));
    }, [records, members, lockerKeys]);

    const filteredRows = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();
        if (!normalizedQuery) return rows;
        return rows.filter(
            (row) =>
                row.memberName.toLowerCase().includes(normalizedQuery) ||
                row.lockerLabel.toLowerCase().includes(normalizedQuery)
        );
    }, [rows, query]);

    const startEditing = (row: AttendanceRow) => setEditingRecord(records.find((record) => record.id === row.id) ?? null);
    const cancelEditing = () => setEditingRecord(null);

    const submitRecord = async (values: AttendanceFormValues) => {
        const timestamp = nowInPhilippineTime();
        const reference = memberName(members.find((member) => member.id === values.member_id));
        if (editingRecord) {
            await attendanceRepository.update(editingRecord.id, { ...values, date_updated: timestamp });
            await logAudit(reference, 'Updated attendance');
            setEditingRecord(null);
        } else {
            await attendanceRepository.add({ ...values, date_created: timestamp, date_updated: timestamp });
            await logAudit(reference, 'Checked in');
        }
    };

    /** Stamps time_out with the current time for a member who is still checked in. */
    const checkOut = async (row: AttendanceRow) => {
        const timestamp = nowInPhilippineTime();
        await attendanceRepository.update(row.id, { time_out: timestamp, date_updated: timestamp });
        await logAudit(row.memberName, 'Checked out');
    };

    return {
        rows: filteredRows,
        members,
        lockerKeys,
        query,
        setQuery,
        loading,
        error,
        editingRecord,
        startEditing,
        cancelEditing,
        submitRecord,
        checkOut,
    };
}
