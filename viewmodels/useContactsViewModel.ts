import { useEffect, useMemo, useState } from 'react';
import type { ContactFormValues } from '../components/ContactForm';
import type { Contact } from '../models/Contact';
import { contactRepository } from '../repositories/activeRepositories';
import { nowInPhilippineTime } from '../utils/dateTime';

export function useContactsViewModel() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingContact, setEditingContact] = useState<Contact | null>(null);

    useEffect(() => {
        const unsubscribe = contactRepository.subscribe(
            (data) => {
                setContacts(data);
                setLoading(false);
            },
            (err) => {
                setError(err.message);
                setLoading(false);
            }
        );
        return unsubscribe;
    }, []);

    const filteredContacts = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();
        if (!normalizedQuery) return contacts;
        return contacts.filter(
            (contact) =>
                contact.name.toLowerCase().includes(normalizedQuery) ||
                contact.phone_number.toLowerCase().includes(normalizedQuery) ||
                contact.email.toLowerCase().includes(normalizedQuery)
        );
    }, [contacts, query]);

    const removeContact = (id: string) => contactRepository.remove(id);

    const startEditing = (contact: Contact) => setEditingContact(contact);
    const cancelEditing = () => setEditingContact(null);

    const submitContact = async (values: ContactFormValues) => {
        const timestamp = nowInPhilippineTime();
        if (editingContact) {
            await contactRepository.update(editingContact.id, { ...values, date_updated: timestamp });
            setEditingContact(null);
        } else {
            await contactRepository.add({
                ...values,
                date_created: timestamp,
                date_updated: timestamp,
                is_deleted: false,
            });
        }
    };

    return {
        contacts: filteredContacts,
        query,
        setQuery,
        loading,
        error,
        editingContact,
        startEditing,
        cancelEditing,
        submitContact,
        removeContact,
    };
}
