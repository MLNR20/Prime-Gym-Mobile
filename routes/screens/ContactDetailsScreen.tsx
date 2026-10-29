import ContactStatusPill from '../../components/ContactStatusPill';
import DetailSection from '../../components/DetailSection';
import DetailsHeader from '../../components/DetailsHeader';
import DetailsScreenLayout from '../../components/DetailsScreenLayout';
import type { Contact } from '../../models/Contact';
import { formatPhilippineTimestamp } from '../../utils/dateTime';

type ContactDetailsScreenProps = {
    contact: Contact;
    onBack: () => void;
    onEdit: () => void;
    onDelete: () => void;
};

export default function ContactDetailsScreen({ contact, onBack, onEdit, onDelete }: ContactDetailsScreenProps) {
    return (
        <DetailsScreenLayout onBack={onBack} onEdit={onEdit} footerText="Manage your contacts right here">
            <DetailSection
                header={
                    <DetailsHeader title={contact.name} subtitle={contact.category} onDelete={onDelete} deleteLabel="Delete contact">
                        <ContactStatusPill contact={contact} />
                    </DetailsHeader>
                }
                title="Contact Information"
                description="How to reach this contact and when it changed."
                rows={[
                    { label: 'Phone Number', value: contact.phone_number || '—' },
                    { label: 'Email', value: contact.email || '—' },
                    { label: 'Notes', value: contact.notes || '—', fullWidth: true },
                    { label: 'Date Created', value: formatPhilippineTimestamp(contact.date_created) },
                    { label: 'Date Updated', value: formatPhilippineTimestamp(contact.date_updated) },
                ]}
            />
        </DetailsScreenLayout>
    );
}
