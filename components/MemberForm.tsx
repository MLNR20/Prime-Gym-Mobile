import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, SegmentedButtons, Text, TextInput } from 'react-native-paper';
import type { Member, MembershipPlan } from '../models/Member';
import { commonStyles } from './commonStyles';

const PLANS: MembershipPlan[] = ['Basic', 'Standard', 'Premium'];

export type MemberFormValues = {
    first_name: string;
    last_name: string;
    payment_date: string;
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
    const [subscriptionExpirationDate, setSubscriptionExpirationDate] = useState('');
    const [plan, setPlan] = useState<MembershipPlan>('Basic');

    useEffect(() => {
        setFirstName(editingMember?.first_name ?? '');
        setLastName(editingMember?.last_name ?? '');
        setPaymentDate(editingMember?.payment_date ?? '');
        setSubscriptionExpirationDate(editingMember?.subscription_expiration_date ?? '');
        setPlan(editingMember?.plan ?? 'Basic');
    }, [editingMember]);

    const handleSubmit = () => {
        const trimmedFirstName = firstName.trim();
        const trimmedLastName = lastName.trim();
        if (!trimmedFirstName || !trimmedLastName) return;
        onSubmit({
            first_name: trimmedFirstName,
            last_name: trimmedLastName,
            payment_date: paymentDate.trim(),
            subscription_expiration_date: subscriptionExpirationDate.trim(),
            plan,
        });
        if (!editingMember) {
            setFirstName('');
            setLastName('');
            setPaymentDate('');
            setSubscriptionExpirationDate('');
            setPlan('Basic');
        }
    };

    return (
        <View style={styles.container}>
            <Text className="text-lg font-poppins-bold">
                {editingMember ? 'Edit Subscriber' : 'Add Subscriber'}
            </Text>
            <TextInput mode="flat" style={commonStyles.inputField} label="First Name" value={firstName} onChangeText={setFirstName} />
            <TextInput mode="outlined" style={commonStyles.inputField} label="Last Name" value={lastName} onChangeText={setLastName} />
            <TextInput
                mode="outlined"
                label="Payment Date (YYYY-MM-DD)"
                value={paymentDate}
                onChangeText={setPaymentDate}
            />
            <TextInput
                mode="outlined"
                label="Subscription Expiration Date (YYYY-MM-DD)"
                value={subscriptionExpirationDate}
                onChangeText={setSubscriptionExpirationDate}
            />
            <SegmentedButtons
                value={plan}
                onValueChange={(value) => setPlan(value as MembershipPlan)}
                buttons={PLANS.map((planOption) => ({ value: planOption, label: planOption }))}
            />

            <View style={styles.actions}>
                {editingMember && (
                    <Button mode="text" onPress={onCancel}>
                        Cancel
                    </Button>
                )}
                <Button mode="contained" onPress={handleSubmit} style={commonStyles.submitButton}>
                    {editingMember ? 'Save' : 'Add'}
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
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 8,
    },
});
