import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Switch, Text, TextInput } from 'react-native-paper';
import type { Equipment } from '../models/Equipment';
import { commonStyles } from './commonStyles';

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
            <Text className="text-lg font-poppins-bold">
                {editingEquipment ? 'Edit Equipment' : 'Add Equipment'}
            </Text>
            <TextInput mode="outlined" style={commonStyles.inputField} label="Equipment Title" value={title} onChangeText={setTitle} />
            <View style={styles.switchRow}>
                <Text>Active</Text>
                <Switch value={isActive} onValueChange={setIsActive} />
            </View>

            <View style={styles.actions}>
                {editingEquipment && (
                    <Button mode="text" onPress={onCancel}>
                        Cancel
                    </Button>
                )}
                <Button mode="contained" onPress={handleSubmit} style={commonStyles.submitButton}>
                    {editingEquipment ? 'Save' : 'Add'}
                </Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        gap: 12,
    },
    switchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 4,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 8,
    },
});
