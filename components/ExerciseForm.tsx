import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import type { Exercise, MuscleGroup } from '../models/Exercise';
import type { Program } from '../models/Program';
import { MUSCLE_GROUPS } from '../utils/muscleGroup';
import { commonStyles } from './commonStyles';
import FormSelect from './FormSelect';
import FormTextInput from './FormTextInput';

export type ExerciseFormValues = {
    name: string;
    description: string;
    muscle_group: MuscleGroup;
    /** '' when the exercise isn't assigned to a program. */
    program_id: string;
};

type ExerciseFormProps = {
    editingExercise: Exercise | null;
    programs: Program[];
    onSubmit: (values: ExerciseFormValues) => void;
    onCancel: () => void;
};

const MUSCLE_GROUP_OPTIONS = MUSCLE_GROUPS.map((group) => ({ value: group, label: group }));

export default function ExerciseForm({ editingExercise, programs, onSubmit, onCancel }: ExerciseFormProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [muscleGroup, setMuscleGroup] = useState<MuscleGroup>('Other');
    const [programId, setProgramId] = useState('');
    const [nameError, setNameError] = useState('');

    useEffect(() => {
        setNameError('');
        setName(editingExercise?.name ?? '');
        setDescription(editingExercise?.description ?? '');
        setMuscleGroup(editingExercise?.muscle_group ?? 'Other');
        setProgramId(editingExercise?.program_id ?? '');
    }, [editingExercise]);

    const handleSubmit = () => {
        const trimmedName = name.trim();
        if (!trimmedName) {
            setNameError('Name is required.');
            return;
        }
        onSubmit({
            name: trimmedName,
            description: description.trim(),
            muscle_group: muscleGroup,
            program_id: programId,
        });
        if (!editingExercise) {
            setName('');
            setDescription('');
            setMuscleGroup('Other');
            setProgramId('');
        }
    };

    const programOptions = [
        { value: '', label: 'None' },
        ...programs.map((program) => ({ value: program.id, label: program.name })),
    ];

    return (
        <View style={styles.container}>
            <FormTextInput
                label="Name"
                value={name}
                onChangeText={(text) => {
                    setName(text);
                    setNameError('');
                }}
                errorMessage={nameError}
            />
            <FormTextInput label="Description" value={description} onChangeText={setDescription} multiline />
            <FormSelect label="Muscle Group" value={muscleGroup} options={MUSCLE_GROUP_OPTIONS} onChange={setMuscleGroup} />
            <FormSelect label="Program" value={programId} options={programOptions} onChange={setProgramId} placeholder="None" />

            <View style={styles.actions}>
                {editingExercise && (
                    <Button mode="text" textColor="#6B7280" onPress={onCancel}>
                        Cancel
                    </Button>
                )}
                <Button mode="contained" textColor="#fff" contentStyle={commonStyles.submitButtonContent} onPress={handleSubmit} style={commonStyles.submitButton}>
                    {editingExercise ? 'Save' : 'Add'}
                </Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        gap: 20,
    },
    actions: {
        width: '100%',
        gap: 8,
    },
});
