import { getDb } from '../db/sqlite';
import type { Contact, NewContact } from '../models/Contact';
import { SqliteRepository } from './SqliteRepository';

function fromRow(row: Record<string, unknown>): Contact {
    return {
        id: row.id as string,
        name: row.name as string,
        phone_number: row.phone_number as string,
        email: row.email as string,
        category: row.category as Contact['category'],
        notes: row.notes as string,
        date_created: row.date_created as string,
        date_updated: row.date_updated as string,
        is_deleted: Boolean(row.is_deleted),
    };
}

export const sqliteContactRepository = new SqliteRepository<Contact, NewContact>(
    getDb(),
    'contacts',
    fromRow,
    'name'
);
