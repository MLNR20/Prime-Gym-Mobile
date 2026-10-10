import { getDb } from '../db/sqlite';
import type { Equipment, NewEquipment } from '../models/Equipment';
import { SqliteRepository } from './SqliteRepository';

function fromRow(row: Record<string, unknown>): Equipment {
    return {
        id: row.id as string,
        title: row.title as string,
        is_active: Boolean(row.is_active),
        date_created: row.date_created as string,
        date_updated: row.date_updated as string,
    };
}

export const sqliteEquipmentRepository = new SqliteRepository<Equipment, NewEquipment>(
    getDb(),
    'equipment',
    fromRow,
    'title'
);
