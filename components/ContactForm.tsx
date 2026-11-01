import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import type { Contact, ContactCategory } from '../models/Contact';
import FormSelect from './FormSelect';
import FormActions from './FormActions';
import FormTextInput from './FormTextInput';

const CATEGORIES: ContactCategory[] = ['Staff', 'Trainer', 'Supplier', 'Emergency', 'Other'];
const CATEGORY_OPTIONS = CATEGORIES.map((category) => ({ value: category, label: category }));

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
            <FormSelect label="Category" value={category} options={CATEGORY_OPTIONS} onChange={setCategory} />
            <FormTextInput label="Notes" value={notes} onChangeText={setNotes} multiline />

            <FormActions submitLabel={editingContact ? 'Save' : 'Add'} onSubmit={handleSubmit} onCancel={editingContact ? onCancel : undefined} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        gap: 20,
    },
});
