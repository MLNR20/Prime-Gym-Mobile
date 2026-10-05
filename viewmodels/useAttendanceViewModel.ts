import { useCallback, useEffect, useMemo, useState } from 'react';
import type { MemberFormValues } from '../components/MemberForm';
import type { Member } from '../models/Member';
import { memberRepository } from '../repositories/activeRepositories';
import { checkIn, checkOut, subscribeToAttendanceForDate } from '../repositories/AttendanceRepository';
import { nowInPhilippineTime } from '../utils/dateTime';

function todayKey() {
    return new Date().toISOString().slice(0, 10);
}

export function useAttendanceViewModel() {
    const [members, setMembers] = useState<Member[]>([]);
    const [presentMemberIds, setPresentMemberIds] = useState<Set<string>>(new Set());
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const date = useMemo(todayKey, []);

    useEffect(() => {
        const unsubscribeMembers = memberRepository.subscribe(
            (data) => {
                setMembers(data);
                setLoading(false);
            },
            (err) => {
                setError(err.message);
                setLoading(false);
            }
        );
        const unsubscribeAttendance = subscribeToAttendanceForDate(date, setPresentMemberIds, (err) =>
            setError(err.message)
        );
        return () => {
            unsubscribeMembers();
            unsubscribeAttendance();
        };
    }, [date]);

    const filteredMembers = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();
        if (!normalizedQuery) return members;
        return members.filter(
            (member) =>
                `${member.first_name} ${member.last_name}`.toLowerCase().includes(normalizedQuery) ||
                member.id.toLowerCase().includes(normalizedQuery)
        );
    }, [members, query]);

    const toggleAttendance = useCallback(
        (memberId: string) => {
            if (presentMemberIds.has(memberId)) {
                return checkOut(memberId, date);
            }
            return checkIn(memberId, date);
        },
        [presentMemberIds, date]
    );

    const addMember = useCallback((values: MemberFormValues) => {
        const timestamp = nowInPhilippineTime();
        return memberRepository.add({
            ...values,
            date_created: timestamp,
            date_updated: timestamp,
            is_deleted: false,
        });
    }, []);

    return {
        members: filteredMembers,
        query,
        setQuery,
        presentMemberIds,
        toggleAttendance,
        addMember,
        loading,
        error,
    };
}
