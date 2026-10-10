import Pill from './Pill';
import type { Contact } from '../models/Contact';
import { CONTACT_STATUS_LABELS, getContactStatus, type ContactStatus } from '../utils/contactStatus';

const STATUS_VARIANTS: Record<ContactStatus, 'success' | 'danger'> = {
    active: 'success',
    inactive: 'danger',
};

type ContactStatusPillProps = {
    contact: Contact;
};

export default function ContactStatusPill({ contact }: ContactStatusPillProps) {
    const status = getContactStatus(contact);
    return <Pill label={CONTACT_STATUS_LABELS[status]} variant={STATUS_VARIANTS[status]} />;
}
