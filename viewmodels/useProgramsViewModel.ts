import { useEffect, useMemo, useState } from 'react';
import type { ProgramFormValues } from '../components/ProgramForm';
import type { Exercise } from '../models/Exercise';
import type { Member } from '../models/Member';
import type { Program } from '../models/Program';
import { exerciseRepository, memberRepository, programRepository } from '../repositories/activeRepositories';
import { logAudit } from '../utils/auditLog';
import { nowInPhilippineTime } from '../utils/dateTime';
import { getMemberStatus } from '../utils/memberStatus';

export function useProgramsViewModel() {
    const [programs, setPrograms] = useState<Program[]>([]);
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [members, setMembers] = useState<Member[]>([]);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingProgram, setEditingProgram] = useState<Program | null>(null);

    useEffect(() => {
        const unsubscribe = programRepository.subscribe(
            (data) => {
                setPrograms(data);
                setLoading(false);
            },
            (err) => {
                setError(err.message);
                setLoading(false);
            }
        );
        return unsubscribe;
    }, []);

    useEffect(() => {
        // Exercises feed each program's exercise list and count.
        const unsubscribe = exerciseRepository.subscribe(setExercises, (err) => setError(err.message));
        return unsubscribe;
    }, []);

    useEffect(() => {
        // Subscribers feed each program's assigned list and the assign picker.
        const unsubscribe = memberRepository.subscribe(setMembers, (err) => setError(err.message));
        return unsubscribe;
    }, []);

    const exercisesFor = (program: Program) => exercises.filter((exercise) => exercise.program_id === program.id);

    const subscribers = useMemo(() => members.filter((member) => !member.is_deleted), [members]);
    const subscribersFor = (program: Program) => subscribers.filter((member) => member.program_id === program.id);

    const filteredPrograms = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();
        if (!normalizedQuery) return programs;
        return programs.filter(
            (program) =>
                program.name.toLowerCase().includes(normalizedQuery) ||
                program.description.toLowerCase().includes(normalizedQuery)
        );
    }, [programs, query]);

    /**
     * Assigns a subscriber to a program, replacing any program they were on. Only subscribers with a valid
     * (non-expired) subscription qualify; the check runs against the latest stored data, not the picker's copy.
     */
    const assignSubscriber = async (program: Program, member: Member) => {
        const latest = members.find((candidate) => candidate.id === member.id) ?? member;
        const name = `${latest.first_name} ${latest.last_name}`;
        const status = getMemberStatus(latest);
        if (status === 'inactive') throw new Error(`${name} is no longer an active subscriber.`);
        if (status === 'expired') throw new Error(`${name}'s subscription has expired. Renew it before assigning a program.`);
        if (latest.program_id === program.id) return;

        await memberRepository.update(latest.id, { program_id: program.id, date_updated: nowInPhilippineTime() });
        await logAudit(`${name} → ${program.name}`, 'Assigned subscriber to program');
    };

    const unassignSubscriber = async (program: Program, member: Member) => {
        await memberRepository.update(member.id, { program_id: '', date_updated: nowInPhilippineTime() });
        await logAudit(`${member.first_name} ${member.last_name} → ${program.name}`, 'Unassigned subscriber from program');
    };

    /** Deleting a program unassigns its exercises and subscribers (they are kept), so none is left pointing at it. */
    const removeProgram = async (program: Program) => {
        const timestamp = nowInPhilippineTime();
        for (const exercise of exercisesFor(program)) {
            await exerciseRepository.update(exercise.id, { program_id: '', date_updated: timestamp });
        }
        for (const member of members.filter((candidate) => candidate.program_id === program.id)) {
            await memberRepository.update(member.id, { program_id: '', date_updated: timestamp });
        }
        await programRepository.remove(program.id);
        await logAudit(program.name, 'Removed program');
    };

    const startEditing = (program: Program) => setEditingProgram(program);
    const cancelEditing = () => setEditingProgram(null);

    const submitProgram = async (values: ProgramFormValues) => {
        const timestamp = nowInPhilippineTime();
        if (editingProgram) {
            await programRepository.update(editingProgram.id, { ...values, date_updated: timestamp });
            await logAudit(values.name, 'Updated program');
            setEditingProgram(null);
        } else {
            await programRepository.add({
                ...values,
                date_created: timestamp,
                date_updated: timestamp,
            });
            await logAudit(values.name, 'Added new program');
        }
    };

    return {
        programs: filteredPrograms,
        exercisesFor,
        subscribers,
        subscribersFor,
        assignSubscriber,
        unassignSubscriber,
        query,
        setQuery,
        loading,
        error,
        editingProgram,
        startEditing,
        cancelEditing,
        submitProgram,
        removeProgram,
    };
}
