import { useEffect, useMemo, useState } from 'react';
import type { ExerciseFormValues } from '../components/ExerciseForm';
import type { Exercise } from '../models/Exercise';
import type { Program } from '../models/Program';
import { exerciseRepository, programRepository } from '../repositories/activeRepositories';
import { logAudit } from '../utils/auditLog';
import { nowInPhilippineTime } from '../utils/dateTime';

export function useExercisesViewModel() {
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [programs, setPrograms] = useState<Program[]>([]);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);

    useEffect(() => {
        const unsubscribe = exerciseRepository.subscribe(
            (data) => {
                setExercises(data);
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
        // Programs only feed the selector and the program name shown on each exercise.
        const unsubscribe = programRepository.subscribe(setPrograms, (err) => setError(err.message));
        return unsubscribe;
    }, []);

    /** Name of the program an exercise is assigned to, or '' when it has none. */
    const programNameFor = (exercise: Exercise) =>
        programs.find((program) => program.id === exercise.program_id)?.name ?? '';

    const filteredExercises = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();
        if (!normalizedQuery) return exercises;
        return exercises.filter((exercise) => {
            const programName = programs.find((program) => program.id === exercise.program_id)?.name ?? '';
            return (
                exercise.name.toLowerCase().includes(normalizedQuery) ||
                exercise.muscle_group.toLowerCase().includes(normalizedQuery) ||
                programName.toLowerCase().includes(normalizedQuery)
            );
        });
    }, [exercises, programs, query]);

    const removeExercise = async (exercise: Exercise) => {
        await exerciseRepository.remove(exercise.id);
        await logAudit(exercise.name, 'Removed exercise');
    };

    const startEditing = (exercise: Exercise) => setEditingExercise(exercise);
    const cancelEditing = () => setEditingExercise(null);

    const submitExercise = async (values: ExerciseFormValues) => {
        const timestamp = nowInPhilippineTime();
        if (editingExercise) {
            await exerciseRepository.update(editingExercise.id, { ...values, date_updated: timestamp });
            await logAudit(values.name, 'Updated exercise');
            setEditingExercise(null);
        } else {
            await exerciseRepository.add({
                ...values,
                date_created: timestamp,
                date_updated: timestamp,
            });
            await logAudit(values.name, 'Added new exercise');
        }
    };

    return {
        exercises: filteredExercises,
        programs,
        programNameFor,
        query,
        setQuery,
        loading,
        error,
        editingExercise,
        startEditing,
        cancelEditing,
        submitExercise,
        removeExercise,
    };
}
