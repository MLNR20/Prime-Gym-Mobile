import { getDb } from '../db/sqlite';
import type { LockerKey, NewLockerKey } from '../models/LockerKey';
import { SqliteRepository } from './SqliteRepository';

function fromRow(row: Record<string, unknown>): LockerKey {
    return {
        id: row.id as string,
        locker_number: row.locker_number as string,
        key_code: row.key_code as string,
        status: row.status as LockerKey['status'],
        assigned_to: row.assigned_to as string,
        date_created: row.date_created as string,
        date_updated: row.date_updated as string,
    };
}

export const sqliteLockerKeyRepository = new SqliteRepository<LockerKey, NewLockerKey>(
    getDb(),
    'locker_keys',
    fromRow,
    'locker_number'
);
