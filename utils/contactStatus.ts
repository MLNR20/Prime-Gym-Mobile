import type { Contact } from '../models/Contact';

export type ContactStatus = 'active' | 'inactive';

export const CONTACT_STATUS_LABELS: Record<ContactStatus, string> = {
    active: 'Active',
    inactive: 'Inactive',
};

export function getContactStatus(contact: Contact): ContactStatus {
    return contact.is_deleted ? 'inactive' : 'active';
}
