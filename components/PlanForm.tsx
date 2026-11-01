import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import type { Plan } from '../models/Plan';
import FormActions from './FormActions';
import FormTextInput from './FormTextInput';

export type PlanFormValues = {
    name: string;
    price: number;
    duration_months: number;
};

type PlanFormProps = {
    editingPlan: Plan | null;
    onSubmit: (values: PlanFormValues) => void;
    onCancel: () => void;
};

export default function PlanForm({ editingPlan, onSubmit, onCancel }: PlanFormProps) {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [durationMonths, setDurationMonths] = useState('1');
    const [errors, setErrors] = useState<{ name?: string; price?: string; duration?: string }>({});

    useEffect(() => {
        setName(editingPlan?.name ?? '');
        setPrice(editingPlan ? String(editingPlan.price) : '');
        setDurationMonths(editingPlan ? String(editingPlan.duration_months) : '1');
        setErrors({});
    }, [editingPlan]);

    const handleSubmit = () => {
        const trimmedName = name.trim();
        const parsedPrice = price.trim() === '' ? 0 : Number.parseFloat(price);
        const parsedDuration = Number.parseInt(durationMonths, 10);
        const nextErrors: typeof errors = {};
        if (!trimmedName) nextErrors.name = 'Enter a plan name.';
        if (!Number.isFinite(parsedPrice) || parsedPrice < 0) nextErrors.price = 'Enter a valid price.';
        if (!Number.isInteger(parsedDuration) || parsedDuration < 1) nextErrors.duration = 'Enter at least 1 month.';
        setErrors(nextErrors);
        if (nextErrors.name || nextErrors.price || nextErrors.duration) return;

        onSubmit({ name: trimmedName, price: parsedPrice, duration_months: parsedDuration });
        if (!editingPlan) {
            setName('');
            setPrice('');
            setDurationMonths('1');
        }
    };

    return (
        <View style={styles.container}>
            <FormTextInput
                label="Plan Name"
                value={name}
                onChangeText={(text) => {
                    setName(text);
                    setErrors((current) => ({ ...current, name: undefined }));
                }}
                errorMessage={errors.name}
            />
            <FormTextInput
                label="Price"
                placeholder="0.00"
                keyboardType="decimal-pad"
                value={price}
                onChangeText={(text) => {
                    setPrice(text);
                    setErrors((current) => ({ ...current, price: undefined }));
                }}
                errorMessage={errors.price}
            />
            <FormTextInput
                label="Duration (months)"
                keyboardType="number-pad"
                value={durationMonths}
                onChangeText={(text) => {
                    setDurationMonths(text.replace(/\D/g, ''));
                    setErrors((current) => ({ ...current, duration: undefined }));
                }}
                errorMessage={errors.duration}
            />

            <FormActions submitLabel={editingPlan ? 'Save' : 'Add'} onSubmit={handleSubmit} onCancel={editingPlan ? onCancel : undefined} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        gap: 20,
    },
});
