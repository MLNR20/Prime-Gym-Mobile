import { getDb } from '../db/sqlite';
import type { NewPlan, Plan } from '../models/Plan';
import { SqliteRepository } from './SqliteRepository';

function fromRow(row: Record<string, unknown>): Plan {
    return {
        id: row.id as string,
        name: row.name as string,
        price: Number(row.price ?? 0),
        duration_months: Number(row.duration_months ?? 1),
        date_created: row.date_created as string,
        date_updated: row.date_updated as string,
    };
}

// Cheapest first, so the list and the plan dropdown read from basic to premium.
export const sqlitePlanRepository = new SqliteRepository<Plan, NewPlan>(
    getDb(),
    'membership_plans',
    fromRow,
    'price, date_created'
);
