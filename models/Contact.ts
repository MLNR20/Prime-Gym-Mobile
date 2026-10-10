export type ContactCategory = 'Staff' | 'Trainer' | 'Supplier' | 'Emergency' | 'Other';

export type Contact = {
    id: string;
    name: string;
    phone_number: string;
    email: string;
    category: ContactCategory;
    notes: string;
    date_created: string;
    date_updated: string;
    is_deleted: boolean;
};

export type NewContact = Omit<Contact, 'id'>;
