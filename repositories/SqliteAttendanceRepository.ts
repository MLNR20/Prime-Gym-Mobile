import { getDb } from '../db/sqlite';
import type { AttendanceRecord, NewAttendanceRecord } from '../models/AttendanceRecord';
import { SqliteRepository } from './SqliteRepository';

function fromRow(row: Record<string, unknown>): AttendanceRecord {
    return {
        id: row.id as string,
        member_id: row.member_id as string,
        locker_key_id: row.locker_key_id as string,
        time_in: row.time_in as string,
        time_out: row.time_out as string,
        date_created: row.date_created as string,
        date_updated: row.date_updated as string,
    };
}

export const sqliteAttendanceRepository = new SqliteRepository<AttendanceRecord, NewAttendanceRecord>(
    getDb(),
    'attendance_records',
    fromRow,
    'time_in DESC'
);
