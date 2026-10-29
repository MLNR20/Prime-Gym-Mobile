import { getDb } from '../db/sqlite';
import type { NewNotification, Notification } from '../models/Notification';
import { SqliteRepository } from './SqliteRepository';

function fromRow(row: Record<string, unknown>): Notification {
    return {
        id: row.id as string,
        header: row.header as string,
        subheader: row.subheader as string,
        is_read: Boolean(row.is_read),
        date_created: row.date_created as string,
        date_updated: row.date_updated as string,
    };
}

// Newest first, so the inbox reads like an email list.
export const sqliteNotificationRepository = new SqliteRepository<Notification, NewNotification>(
    getDb(),
    'notifications',
    fromRow,
    'date_created DESC'
);
