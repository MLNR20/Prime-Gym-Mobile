import { useEffect, useMemo, useState } from 'react';
import type { MemberFormValues } from '../components/MemberForm';
import type { Member } from '../models/Member';
import { memberRepository } from '../repositories/activeRepositories';
import { logAudit } from '../utils/auditLog';
import { nowInPhilippineTime } from '../utils/dateTime';

export function useSubscribersViewModel() {
    const [members, setMembers] = useState<Member[]>([]);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingMember, setEditingMember] = useState<Member | null>(null);

    useEffect(() => {
        const unsubscribe = memberRepository.subscribe(
            (data) => {
                setMembers(data);
                setLoading(false);
            },
            (err) => {
                setError(err.message);
                setLoading(false);
            }
        );
        return unsubscribe;
    }, []);

    const filteredMembers = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();
        if (!normalizedQuery) return members;
        return members.filter(
            (member) =>
                `${member.first_name} ${member.last_name}`.toLowerCase().includes(normalizedQuery) ||
                member.id.toLowerCase().includes(normalizedQuery)
        );
    }, [members, query]);

    const removeMember = async (member: Member) => {
        await memberRepository.remove(member.id);
        await logAudit(`${member.first_name} ${member.last_name}`, 'Removed subscriber');
    };

    const startEditing = (member: Member) => setEditingMember(member);
    const cancelEditing = () => setEditingMember(null);

    const submitMember = async (values: MemberFormValues) => {
        const timestamp = nowInPhilippineTime();
        const reference = `${values.first_name} ${values.last_name}`;
        if (editingMember) {
            await memberRepository.update(editingMember.id, { ...values, date_updated: timestamp });
            await logAudit(reference, 'Updated subscriber');
            setEditingMember(null);
        } else {
            // New members are always created active, timestamped in Philippine Standard Time.
            await memberRepository.add({
                ...values,
                date_created: timestamp,
                date_updated: timestamp,
                is_deleted: false,
            });
            await logAudit(reference, 'Added new subscriber');
        }
    };

    return {
        members: filteredMembers,
        query,
        setQuery,
        loading,
        error,
        editingMember,
        startEditing,
        cancelEditing,
        submitMember,
        removeMember,
    };
}
