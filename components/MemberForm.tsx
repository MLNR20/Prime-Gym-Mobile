import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import type { Member, MembershipPlan } from '../models/Member';
import { inputDateToIso, isoToInputDate, maskInputDate } from '../utils/dateTime';
import { usePlanNames } from '../viewmodels/usePlansViewModel';
import FormSelect from './FormSelect';
import FormActions from './FormActions';
import FormTextInput from './FormTextInput';

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
    const planNames = usePlanNames();
    const defaultPlan = planNames[0] ?? 'Basic';
    const [plan, setPlan] = useState<MembershipPlan>(defaultPlan);
    const [errors, setErrors] = useState<{ paymentDate?: string; expirationDate?: string }>({});

    useEffect(() => {
        setFirstName(editingMember?.first_name ?? '');
        setLastName(editingMember?.last_name ?? '');
        setErrors({});
        setPaymentDate(editingMember ? isoToInputDate(editingMember.payment_date) : '');
        setPaymentAmount(editingMember?.payment_amount ? String(editingMember.payment_amount) : '');
        setSubscriptionExpirationDate(editingMember ? isoToInputDate(editingMember.subscription_expiration_date) : '');
        setPlan(editingMember?.plan ?? defaultPlan);
    }, [editingMember]);

    // The plans load asynchronously, so a new subscriber's default follows them until a plan is picked.
    useEffect(() => {
        if (!editingMember) setPlan(defaultPlan);
    }, [defaultPlan]);

    // A subscriber's current plan stays selectable even if it has since been removed from Settings.
    const planOptions = [...new Set([...planNames, plan])].map((name) => ({ value: name, label: name }));

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
            setPlan(defaultPlan);
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
            <FormSelect label="Plan" value={plan} options={planOptions} onChange={setPlan} />

            <FormActions submitLabel={editingMember ? 'Save' : 'Add'} onSubmit={handleSubmit} onCancel={editingMember ? onCancel : undefined} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        gap: 20,
    },
});
