import { getDb } from '../db/sqlite';
import type { Exercise, NewExercise } from '../models/Exercise';
import { SqliteRepository } from './SqliteRepository';

function fromRow(row: Record<string, unknown>): Exercise {
    return {
        id: row.id as string,
        name: row.name as string,
        description: row.description as string,
        muscle_group: row.muscle_group as Exercise['muscle_group'],
        program_id: row.program_id as string,
        date_created: row.date_created as string,
        date_updated: row.date_updated as string,
    };
}

export const sqliteExerciseRepository = new SqliteRepository<Exercise, NewExercise>(
    getDb(),
    'exercises',
    fromRow,
    'name'
);
