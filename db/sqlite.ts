import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite';

let dbPromise: Promise<SQLiteDatabase> | null = null;

// Columns the `members` table must have, with the DEFAULT used when backfilling a column
// onto a table created by an earlier schema version (SQLite's ADD COLUMN requires a default
// for NOT NULL columns since existing rows need a value).
const MEMBERS_COLUMNS: [name: string, definition: string][] = [
    ['first_name', "TEXT NOT NULL DEFAULT ''"],
    ['last_name', "TEXT NOT NULL DEFAULT ''"],
    ['payment_date', "TEXT NOT NULL DEFAULT ''"],
    ['subscription_expiration_date', "TEXT NOT NULL DEFAULT ''"],
    ['plan', "TEXT NOT NULL DEFAULT 'Basic'"],
    ['date_created', "TEXT NOT NULL DEFAULT ''"],
    ['date_updated', "TEXT NOT NULL DEFAULT ''"],
    ['is_deleted', 'INTEGER NOT NULL DEFAULT 0'],
];

function createMembersTableSql(table: string): string {
    return `
        CREATE TABLE IF NOT EXISTS ${table} (
            id TEXT PRIMARY KEY NOT NULL,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            payment_date TEXT NOT NULL,
            subscription_expiration_date TEXT NOT NULL,
            plan TEXT NOT NULL,
            date_created TEXT NOT NULL,
            date_updated TEXT NOT NULL,
            is_deleted INTEGER NOT NULL DEFAULT 0
        );
    `;
}

/**
 * `CREATE TABLE IF NOT EXISTS` is a no-op once the table already exists on-device, so a column
 * added to the schema after a user already has the app doesn't show up on its own — backfill any
 * columns missing from an existing table. A column removed from the schema (e.g. the old
 * `name TEXT NOT NULL`) would still reject every insert, so rebuild the table without it.
 */
async function migrateMembersTable(db: SQLiteDatabase): Promise<void> {
    const existingColumns = await db.getAllAsync<{ name: string }>(`PRAGMA table_info(members)`);
    const existingNames = new Set(existingColumns.map((column) => column.name));
    for (const [name, definition] of MEMBERS_COLUMNS) {
        if (!existingNames.has(name)) {
            await db.execAsync(`ALTER TABLE members ADD COLUMN ${name} ${definition};`);
        }
    }

    const expectedNames = new Set(['id', ...MEMBERS_COLUMNS.map(([name]) => name)]);
    const hasObsoleteColumns = [...existingNames].some((name) => !expectedNames.has(name));
    if (!hasObsoleteColumns) return;

    const firstName = existingNames.has('name')
        ? `CASE WHEN first_name = '' THEN (CASE WHEN instr(name, ' ') > 0 THEN substr(name, 1, instr(name, ' ') - 1) ELSE name END) ELSE first_name END`
        : 'first_name';
    const lastName = existingNames.has('name')
        ? `CASE WHEN last_name = '' AND instr(name, ' ') > 0 THEN substr(name, instr(name, ' ') + 1) ELSE last_name END`
        : 'last_name';

    await db.execAsync(`
        BEGIN;
        DROP TABLE IF EXISTS members_new;
        ${createMembersTableSql('members_new')}
        INSERT INTO members_new (id, first_name, last_name, payment_date, subscription_expiration_date, plan, date_created, date_updated, is_deleted)
        SELECT id, ${firstName}, ${lastName}, payment_date, subscription_expiration_date, plan, date_created, date_updated, is_deleted
        FROM members;
        DROP TABLE members;
        ALTER TABLE members_new RENAME TO members;
        COMMIT;
    `);
}

/** Opens (once) the on-device database and ensures tables used by the SQLite repositories exist. */
export function getDb(): Promise<SQLiteDatabase> {
    if (!dbPromise) {
        dbPromise = openDatabaseAsync('prime-gym.db').then(async (db) => {
            await db.execAsync(createMembersTableSql('members'));
            await migrateMembersTable(db);
            return db;
        });
    }
    return dbPromise;
}
