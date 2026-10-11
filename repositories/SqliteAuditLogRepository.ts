import { getDb } from '../db/sqlite';
import type { AuditLog, NewAuditLog } from '../models/AuditLog';
import { SqliteRepository } from './SqliteRepository';

function fromRow(row: Record<string, unknown>): AuditLog {
    return {
        id: row.id as string,
        reference: row.reference as string,
        action: row.action as string,
        date_created: row.date_created as string,
        date_updated: row.date_updated as string,
    };
}

export const sqliteAuditLogRepository = new SqliteRepository<AuditLog, NewAuditLog>(
    getDb(),
    'audit_logs',
    fromRow,
    'date_created DESC'
);
