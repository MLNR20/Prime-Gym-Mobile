import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, SegmentedButtons, Text } from 'react-native-paper';
import type { Contact, ContactCategory } from '../models/Contact';
import { commonStyles } from './commonStyles';
import FormTextInput, { FormLabel } from './FormTextInput';

const CATEGORIES: ContactCategory[] = ['Staff', 'Trainer', 'Supplier', 'Emergency', 'Other'];

export type ContactFormValues = {
    name: string;
    phone_number: string;
    email: string;
    category: ContactCategory;
    notes: string;
};

type ContactFormProps = {
    editingContact: Contact | null;
    onSubmit: (values: ContactFormValues) => void;
    onCancel: () => void;
};

export default function ContactForm({ editingContact, onSubmit, onCancel }: ContactFormProps) {
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [category, setCategory] = useState<ContactCategory>('Staff');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        setName(editingContact?.name ?? '');
        setPhoneNumber(editingContact?.phone_number ?? '');
        setEmail(editingContact?.email ?? '');
        setCategory(editingContact?.category ?? 'Staff');
        setNotes(editingContact?.notes ?? '');
    }, [editingContact]);

    const handleSubmit = () => {
        const trimmedName = name.trim();
        if (!trimmedName) return;
        onSubmit({
            name: trimmedName,
            phone_number: phoneNumber.trim(),
            email: email.trim(),
            category,
            notes: notes.trim(),
        });
        if (!editingContact) {
            setName('');
            setPhoneNumber('');
            setEmail('');
            setCategory('Staff');
            setNotes('');
        }
    };

    return (
        <View style={styles.container}>
            <FormTextInput label="Name" value={name} onChangeText={setName} />
            <FormTextInput
                label="Phone Number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
            />
            <FormTextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <View style={styles.group}>
                <FormLabel>Category</FormLabel>
                <SegmentedButtons
                    value={category}
                    onValueChange={(value) => setCategory(value as ContactCategory)}
                    buttons={CATEGORIES.map((categoryOption) => ({ value: categoryOption, label: categoryOption }))}
                />
            </View>
            <FormTextInput label="Notes" value={notes} onChangeText={setNotes} multiline />

            <View style={styles.actions}>
                {editingContact && (
                    <Button mode="text" textColor="#6B7280" onPress={onCancel}>
                        Cancel
                    </Button>
                )}
                <Button mode="contained" textColor="#fff" contentStyle={commonStyles.submitButtonContent} onPress={handleSubmit} style={commonStyles.submitButton}>
                    {editingContact ? 'Save' : 'Add'}
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
    group: {
        width: '100%',
        gap: 6,
    },
    actions: {
        width: '100%',
        gap: 8,
    },
});
