import { useEffect, useMemo, useState } from 'react';
import type { ProgramFormValues } from '../components/ProgramForm';
import type { Exercise } from '../models/Exercise';
import type { Program } from '../models/Program';
import { exerciseRepository, programRepository } from '../repositories/activeRepositories';
import { logAudit } from '../utils/auditLog';
import { nowInPhilippineTime } from '../utils/dateTime';

export function useProgramsViewModel() {
    const [programs, setPrograms] = useState<Program[]>([]);
    const [exercises, setExercises] = useState<Exercise[]>([]);
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

    const exercisesFor = (program: Program) => exercises.filter((exercise) => exercise.program_id === program.id);

    const filteredPrograms = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();
        if (!normalizedQuery) return programs;
        return programs.filter(
            (program) =>
                program.name.toLowerCase().includes(normalizedQuery) ||
                program.description.toLowerCase().includes(normalizedQuery)
        );
    }, [programs, query]);

    /** Deleting a program unassigns its exercises (they are kept), so none is left pointing at it. */
    const removeProgram = async (program: Program) => {
        const timestamp = nowInPhilippineTime();
        for (const exercise of exercisesFor(program)) {
            await exerciseRepository.update(exercise.id, { program_id: '', date_updated: timestamp });
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
