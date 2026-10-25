import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Switch, Text } from 'react-native-paper';
import type { Equipment } from '../models/Equipment';
import { commonStyles } from './commonStyles';
import FormTextInput, { FormLabel } from './FormTextInput';

export type EquipmentFormValues = {
    title: string;
    is_active: boolean;
};

type EquipmentFormProps = {
    editingEquipment: Equipment | null;
    onSubmit: (values: EquipmentFormValues) => void;
    onCancel: () => void;
};

export default function EquipmentForm({ editingEquipment, onSubmit, onCancel }: EquipmentFormProps) {
    const [title, setTitle] = useState('');
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        setTitle(editingEquipment?.title ?? '');
        setIsActive(editingEquipment?.is_active ?? true);
    }, [editingEquipment]);

    const handleSubmit = () => {
        const trimmedTitle = title.trim();
        if (!trimmedTitle) return;
        onSubmit({ title: trimmedTitle, is_active: isActive });
        if (!editingEquipment) {
            setTitle('');
            setIsActive(true);
        }
    };

    return (
        <View style={styles.container}>
            <FormTextInput label="Equipment Title" value={title} onChangeText={setTitle} />
            <View style={styles.switchRow}>
                <Text>Active</Text>
                <Switch value={isActive} onValueChange={setIsActive} />
            </View>

            <View style={styles.actions}>
                {editingEquipment && (
                    <Button mode="text" textColor="#6B7280" onPress={onCancel}>
                        Cancel
                    </Button>
                )}
                <Button mode="contained" textColor="#fff" contentStyle={commonStyles.submitButtonContent} onPress={handleSubmit} style={commonStyles.submitButton}>
                    {editingEquipment ? 'Save' : 'Add'}
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
    switchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 4,
    },
    actions: {
        width: '100%',
        gap: 8,
    },
});
