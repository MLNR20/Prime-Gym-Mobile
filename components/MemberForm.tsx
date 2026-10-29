import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import type { Member, MembershipPlan } from '../models/Member';
import { inputDateToIso, isoToInputDate, maskInputDate } from '../utils/dateTime';
import { commonStyles } from './commonStyles';
import FormSelect from './FormSelect';
import FormTextInput from './FormTextInput';

const PLAN_OPTIONS = (['Basic', 'Standard', 'Premium'] as const).map((plan) => ({ value: plan, label: plan }));

export type MemberFormValues = {
    first_name: string;
    last_name: string;
    payment_date: string;
    payment_amount: number;
    subscription_expiration_date: string;
    plan: MembershipPlan;
};

type MemberFormProps = {
    editingMember: Member | null;
    onSubmit: (values: MemberFormValues) => void;
    onCancel: () => void;
};

export default function MemberForm({ editingMember, onSubmit, onCancel }: MemberFormProps) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [paymentDate, setPaymentDate] = useState('');
    const [paymentAmount, setPaymentAmount] = useState('');
    const [subscriptionExpirationDate, setSubscriptionExpirationDate] = useState('');
    const [plan, setPlan] = useState<MembershipPlan>('Basic');
    const [errors, setErrors] = useState<{ paymentDate?: string; expirationDate?: string }>({});

    useEffect(() => {
        setFirstName(editingMember?.first_name ?? '');
        setLastName(editingMember?.last_name ?? '');
        setErrors({});
        setPaymentDate(editingMember ? isoToInputDate(editingMember.payment_date) : '');
        setPaymentAmount(editingMember?.payment_amount ? String(editingMember.payment_amount) : '');
        setSubscriptionExpirationDate(editingMember ? isoToInputDate(editingMember.subscription_expiration_date) : '');
        setPlan(editingMember?.plan ?? 'Basic');
    }, [editingMember]);

    const handleSubmit = () => {
        const trimmedFirstName = firstName.trim();
        const trimmedLastName = lastName.trim();
        if (!trimmedFirstName || !trimmedLastName) return;
        const isoPaymentDate = inputDateToIso(paymentDate);
        const isoExpirationDate = inputDateToIso(subscriptionExpirationDate);
        if (!isoPaymentDate || !isoExpirationDate) {
            setErrors({
                paymentDate: isoPaymentDate ? undefined : 'Enter a valid date as MM/DD/YYYY.',
                expirationDate: isoExpirationDate ? undefined : 'Enter a valid date as MM/DD/YYYY.',
            });
            return;
        }
        onSubmit({
            first_name: trimmedFirstName,
            last_name: trimmedLastName,
            payment_date: isoPaymentDate,
            payment_amount: Number.parseFloat(paymentAmount) || 0,
            subscription_expiration_date: isoExpirationDate,
            plan,
        });
        if (!editingMember) {
            setFirstName('');
            setLastName('');
            setPaymentDate('');
            setPaymentAmount('');
            setSubscriptionExpirationDate('');
            setPlan('Basic');
        }
    };

    return (
        <View style={styles.container}>
            <FormTextInput label="First Name" value={firstName} onChangeText={setFirstName} />
            <FormTextInput label="Last Name" value={lastName} onChangeText={setLastName} />
            <FormTextInput
                label="Payment Date"
                placeholder="MM/DD/YYYY"
                keyboardType="number-pad"
                maxLength={10}
                value={paymentDate}
                onChangeText={(text) => {
                    setPaymentDate(maskInputDate(text));
                    setErrors((current) => ({ ...current, paymentDate: undefined }));
                }}
                errorMessage={errors.paymentDate}
            />
            <FormTextInput
                label="Payment Amount"
                placeholder="0.00"
                keyboardType="decimal-pad"
                value={paymentAmount}
                onChangeText={setPaymentAmount}
            />
            <FormTextInput
                label="Subscription Expiration Date"
                placeholder="MM/DD/YYYY"
                keyboardType="number-pad"
                maxLength={10}
                value={subscriptionExpirationDate}
                onChangeText={(text) => {
                    setSubscriptionExpirationDate(maskInputDate(text));
                    setErrors((current) => ({ ...current, expirationDate: undefined }));
                }}
                errorMessage={errors.expirationDate}
            />
            <FormSelect label="Plan" value={plan} options={PLAN_OPTIONS} onChange={setPlan} />

            <View style={styles.actions}>
                <Button mode="contained" textColor="#fff" contentStyle={commonStyles.submitButtonContent} labelStyle={styles.buttonLabel} onPress={handleSubmit} style={commonStyles.submitButton}>
                    {editingMember ? 'Save' : 'Add'}
                </Button>
                {editingMember && (
                    <Button
                        mode="outlined"
                        textColor="#6B7280"
                        contentStyle={commonStyles.submitButtonContent}
                        labelStyle={styles.buttonLabel}
                        onPress={onCancel}
                        style={styles.cancelButton}
                    >
                        Cancel
                    </Button>
                )}
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
        gap: 16,
    },
    // Paper's default button label is 14px; +0.2rem (3.2px).
    buttonLabel: {
        fontSize: 17.2,
        lineHeight: 24,
    },
    cancelButton: {
        width: '100%',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#000000',
    },
});
