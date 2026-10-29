import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import type { Program } from '../models/Program';
import { commonStyles } from './commonStyles';
import FormTextInput from './FormTextInput';

export type ProgramFormValues = {
    name: string;
    description: string;
};

type ProgramFormProps = {
    editingProgram: Program | null;
    onSubmit: (values: ProgramFormValues) => void;
    onCancel: () => void;
};

export default function ProgramForm({ editingProgram, onSubmit, onCancel }: ProgramFormProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [nameError, setNameError] = useState('');

    useEffect(() => {
        setNameError('');
        setName(editingProgram?.name ?? '');
        setDescription(editingProgram?.description ?? '');
    }, [editingProgram]);

    const handleSubmit = () => {
        const trimmedName = name.trim();
        if (!trimmedName) {
            setNameError('Name is required.');
            return;
        }
        onSubmit({ name: trimmedName, description: description.trim() });
        if (!editingProgram) {
            setName('');
            setDescription('');
        }
    };

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

            <View style={styles.actions}>
                {editingProgram && (
                    <Button mode="text" textColor="#6B7280" onPress={onCancel}>
                        Cancel
                    </Button>
                )}
                <Button mode="contained" textColor="#fff" contentStyle={commonStyles.submitButtonContent} onPress={handleSubmit} style={commonStyles.submitButton}>
                    {editingProgram ? 'Save' : 'Add'}
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
