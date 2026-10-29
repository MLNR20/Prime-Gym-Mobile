import { getDb } from '../db/sqlite';
import type { Member, NewMember } from '../models/Member';
import { SqliteRepository } from './SqliteRepository';

function fromRow(row: Record<string, unknown>): Member {
    return {
        id: row.id as string,
        first_name: row.first_name as string,
        last_name: row.last_name as string,
        payment_date: row.payment_date as string,
        payment_amount: Number(row.payment_amount ?? 0),
        subscription_expiration_date: row.subscription_expiration_date as string,
        plan: row.plan as Member['plan'],
        date_created: row.date_created as string,
        date_updated: row.date_updated as string,
        is_deleted: Boolean(row.is_deleted),
    };
}

export const sqliteMemberRepository = new SqliteRepository<Member, NewMember>(
    getDb(),
    'members',
    fromRow,
    'last_name'
);
