import { getDb } from '../db/sqlite';
import type { NewProgram, Program } from '../models/Program';
import { SqliteRepository } from './SqliteRepository';

function fromRow(row: Record<string, unknown>): Program {
    return {
        id: row.id as string,
        name: row.name as string,
        description: row.description as string,
        date_created: row.date_created as string,
        date_updated: row.date_updated as string,
    };
}

export const sqliteProgramRepository = new SqliteRepository<Program, NewProgram>(
    getDb(),
    'programs',
    fromRow,
    'name'
);
