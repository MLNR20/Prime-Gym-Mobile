import { useEffect, useState } from 'react';
import type { Member } from '../models/Member';
import { memberRepository } from '../repositories/activeRepositories';
import { subscribeToRecentAttendance } from '../repositories/AttendanceRepository';

export type RecentActivityEntry = {
    id: string;
    memberName: string;
    checkedInAt: number;
};

const RECENT_ACTIVITY_LIMIT = 5;

export function useRecentActivityViewModel() {
    const [members, setMembers] = useState<Member[]>([]);
    const [entries, setEntries] = useState<RecentActivityEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribeMembers = memberRepository.subscribe(setMembers, (err) => setError(err.message));
        return unsubscribeMembers;
    }, []);

    useEffect(() => {
        const unsubscribeAttendance = subscribeToRecentAttendance(
            RECENT_ACTIVITY_LIMIT,
            (records) => {
                setEntries(
                    records.map((record) => {
                        const member = members.find((candidate) => candidate.id === record.memberId);
                        return {
                            id: record.id,
                            memberName: member ? `${member.first_name} ${member.last_name}` : 'Unknown member',
                            checkedInAt: record.checkedInAt,
                        };
                    })
                );
                setLoading(false);
            },
            (err) => {
                setError(err.message);
                setLoading(false);
            }
        );
        return unsubscribeAttendance;
    }, [members]);

    return { entries, loading, error };
}
