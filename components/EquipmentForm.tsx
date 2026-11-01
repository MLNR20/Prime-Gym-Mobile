import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import type { Equipment } from '../models/Equipment';
import FormSelect from './FormSelect';
import FormActions from './FormActions';
import FormTextInput from './FormTextInput';

export type EquipmentFormValues = {
    title: string;
    is_active: boolean;
};

type EquipmentFormProps = {
    editingEquipment: Equipment | null;
    onSubmit: (values: EquipmentFormValues) => void;
    onCancel: () => void;
};

type EquipmentStatus = 'active' | 'inactive';

const STATUS_OPTIONS: { value: EquipmentStatus; label: string }[] = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
];

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
            <FormSelect
                label="Status"
                value={isActive ? 'active' : 'inactive'}
                options={STATUS_OPTIONS}
                onChange={(value) => setIsActive(value === 'active')}
            />

            <FormActions submitLabel={editingEquipment ? 'Save' : 'Add'} onSubmit={handleSubmit} onCancel={editingEquipment ? onCancel : undefined} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        gap: 20,
    },
});
