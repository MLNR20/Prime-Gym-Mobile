import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite';

let dbPromise: Promise<SQLiteDatabase> | null = null;

// Columns the `members` table must have, with the DEFAULT used when backfilling a column
// onto a table created by an earlier schema version (SQLite's ADD COLUMN requires a default
// for NOT NULL columns since existing rows need a value).
const MEMBERS_COLUMNS: [name: string, definition: string][] = [
    ['first_name', "TEXT NOT NULL DEFAULT ''"],
    ['last_name', "TEXT NOT NULL DEFAULT ''"],
    ['payment_date', "TEXT NOT NULL DEFAULT ''"],
    ['payment_amount', 'REAL NOT NULL DEFAULT 0'],
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
            payment_amount REAL NOT NULL DEFAULT 0,
            subscription_expiration_date TEXT NOT NULL,
            plan TEXT NOT NULL,
            date_created TEXT NOT NULL,
            date_updated TEXT NOT NULL,
            is_deleted INTEGER NOT NULL DEFAULT 0
        );
    `;
}

// Columns the `equipment` table must have, with the DEFAULT used when backfilling a column
// onto a table created by an earlier schema version.
const EQUIPMENT_COLUMNS: [name: string, definition: string][] = [
    ['title', "TEXT NOT NULL DEFAULT ''"],
    ['is_active', 'INTEGER NOT NULL DEFAULT 1'],
    ['date_created', "TEXT NOT NULL DEFAULT ''"],
    ['date_updated', "TEXT NOT NULL DEFAULT ''"],
];

function createEquipmentTableSql(table: string): string {
    return `
        CREATE TABLE IF NOT EXISTS ${table} (
            id TEXT PRIMARY KEY NOT NULL,
            title TEXT NOT NULL,
            is_active INTEGER NOT NULL DEFAULT 1,
            date_created TEXT NOT NULL,
            date_updated TEXT NOT NULL
        );
    `;
}

/** Backfills any columns missing from an existing `equipment` table (see migrateMembersTable). */
async function migrateEquipmentTable(db: SQLiteDatabase): Promise<void> {
    const existingColumns = await db.getAllAsync<{ name: string }>(`PRAGMA table_info(equipment)`);
    const existingNames = new Set(existingColumns.map((column) => column.name));
    for (const [name, definition] of EQUIPMENT_COLUMNS) {
        if (!existingNames.has(name)) {
            await db.execAsync(`ALTER TABLE equipment ADD COLUMN ${name} ${definition};`);
        }
    }
}

// Columns the `contacts` table must have, with the DEFAULT used when backfilling a column
// onto a table created by an earlier schema version.
const CONTACTS_COLUMNS: [name: string, definition: string][] = [
    ['name', "TEXT NOT NULL DEFAULT ''"],
    ['phone_number', "TEXT NOT NULL DEFAULT ''"],
    ['email', "TEXT NOT NULL DEFAULT ''"],
    ['category', "TEXT NOT NULL DEFAULT 'Other'"],
    ['notes', "TEXT NOT NULL DEFAULT ''"],
    ['date_created', "TEXT NOT NULL DEFAULT ''"],
    ['date_updated', "TEXT NOT NULL DEFAULT ''"],
    ['is_deleted', 'INTEGER NOT NULL DEFAULT 0'],
];

function createContactsTableSql(table: string): string {
    return `
        CREATE TABLE IF NOT EXISTS ${table} (
            id TEXT PRIMARY KEY NOT NULL,
            name TEXT NOT NULL,
            phone_number TEXT NOT NULL,
            email TEXT NOT NULL,
            category TEXT NOT NULL,
            notes TEXT NOT NULL,
            date_created TEXT NOT NULL,
            date_updated TEXT NOT NULL,
            is_deleted INTEGER NOT NULL DEFAULT 0
        );
    `;
}

/** Backfills any columns missing from an existing `contacts` table (see migrateMembersTable). */
async function migrateContactsTable(db: SQLiteDatabase): Promise<void> {
    const existingColumns = await db.getAllAsync<{ name: string }>(`PRAGMA table_info(contacts)`);
    const existingNames = new Set(existingColumns.map((column) => column.name));
    for (const [name, definition] of CONTACTS_COLUMNS) {
        if (!existingNames.has(name)) {
            await db.execAsync(`ALTER TABLE contacts ADD COLUMN ${name} ${definition};`);
        }
    }
}

// Columns the `locker_keys` table must have, with the DEFAULT used when backfilling a column
// onto a table created by an earlier schema version.
const LOCKER_KEYS_COLUMNS: [name: string, definition: string][] = [
    ['locker_number', "TEXT NOT NULL DEFAULT ''"],
    ['key_code', "TEXT NOT NULL DEFAULT ''"],
    ['status', "TEXT NOT NULL DEFAULT 'Available'"],
    ['assigned_to', "TEXT NOT NULL DEFAULT ''"],
    ['date_created', "TEXT NOT NULL DEFAULT ''"],
    ['date_updated', "TEXT NOT NULL DEFAULT ''"],
];

function createLockerKeysTableSql(table: string): string {
    return `
        CREATE TABLE IF NOT EXISTS ${table} (
            id TEXT PRIMARY KEY NOT NULL,
            locker_number TEXT NOT NULL,
            key_code TEXT NOT NULL,
            status TEXT NOT NULL,
            assigned_to TEXT NOT NULL,
            date_created TEXT NOT NULL,
            date_updated TEXT NOT NULL
        );
    `;
}

/** Backfills any columns missing from an existing `locker_keys` table (see migrateMembersTable). */
async function migrateLockerKeysTable(db: SQLiteDatabase): Promise<void> {
    const existingColumns = await db.getAllAsync<{ name: string }>(`PRAGMA table_info(locker_keys)`);
    const existingNames = new Set(existingColumns.map((column) => column.name));
    for (const [name, definition] of LOCKER_KEYS_COLUMNS) {
        if (!existingNames.has(name)) {
            await db.execAsync(`ALTER TABLE locker_keys ADD COLUMN ${name} ${definition};`);
        }
    }
}

// Columns the `audit_logs` table must have, with the DEFAULT used when backfilling a column
// onto a table created by an earlier schema version.
const AUDIT_LOGS_COLUMNS: [name: string, definition: string][] = [
    ['reference', "TEXT NOT NULL DEFAULT ''"],
    ['action', "TEXT NOT NULL DEFAULT ''"],
    ['date_created', "TEXT NOT NULL DEFAULT ''"],
    ['date_updated', "TEXT NOT NULL DEFAULT ''"],
];

function createAuditLogsTableSql(table: string): string {
    return `
        CREATE TABLE IF NOT EXISTS ${table} (
            id TEXT PRIMARY KEY NOT NULL,
            reference TEXT NOT NULL,
            action TEXT NOT NULL,
            date_created TEXT NOT NULL,
            date_updated TEXT NOT NULL
        );
    `;
}

/** Backfills any columns missing from an existing `audit_logs` table (see migrateMembersTable). */
async function migrateAuditLogsTable(db: SQLiteDatabase): Promise<void> {
    const existingColumns = await db.getAllAsync<{ name: string }>(`PRAGMA table_info(audit_logs)`);
    const existingNames = new Set(existingColumns.map((column) => column.name));
    for (const [name, definition] of AUDIT_LOGS_COLUMNS) {
        if (!existingNames.has(name)) {
            await db.execAsync(`ALTER TABLE audit_logs ADD COLUMN ${name} ${definition};`);
        }
    }
}

// Columns the `attendance_records` table must have, with the DEFAULT used when backfilling a column
// onto a table created by an earlier schema version.
const ATTENDANCE_RECORDS_COLUMNS: [name: string, definition: string][] = [
    ['member_id', "TEXT NOT NULL DEFAULT ''"],
    ['locker_key_id', "TEXT NOT NULL DEFAULT ''"],
    ['time_in', "TEXT NOT NULL DEFAULT ''"],
    ['time_out', "TEXT NOT NULL DEFAULT ''"],
    ['date_created', "TEXT NOT NULL DEFAULT ''"],
    ['date_updated', "TEXT NOT NULL DEFAULT ''"],
];

function createAttendanceRecordsTableSql(table: string): string {
    return `
        CREATE TABLE IF NOT EXISTS ${table} (
            id TEXT PRIMARY KEY NOT NULL,
            member_id TEXT NOT NULL,
            locker_key_id TEXT NOT NULL,
            time_in TEXT NOT NULL,
            time_out TEXT NOT NULL DEFAULT '',
            date_created TEXT NOT NULL,
            date_updated TEXT NOT NULL
        );
    `;
}

/** Backfills any columns missing from an existing `attendance_records` table (see migrateMembersTable). */
async function migrateAttendanceRecordsTable(db: SQLiteDatabase): Promise<void> {
    const existingColumns = await db.getAllAsync<{ name: string }>(`PRAGMA table_info(attendance_records)`);
    const existingNames = new Set(existingColumns.map((column) => column.name));
    for (const [name, definition] of ATTENDANCE_RECORDS_COLUMNS) {
        if (!existingNames.has(name)) {
            await db.execAsync(`ALTER TABLE attendance_records ADD COLUMN ${name} ${definition};`);
        }
    }
}

// Columns the `programs` table must have, with the DEFAULT used when backfilling a column
// onto a table created by an earlier schema version.
const PROGRAMS_COLUMNS: [name: string, definition: string][] = [
    ['name', "TEXT NOT NULL DEFAULT ''"],
    ['description', "TEXT NOT NULL DEFAULT ''"],
    ['date_created', "TEXT NOT NULL DEFAULT ''"],
    ['date_updated', "TEXT NOT NULL DEFAULT ''"],
];

function createProgramsTableSql(table: string): string {
    return `
        CREATE TABLE IF NOT EXISTS ${table} (
            id TEXT PRIMARY KEY NOT NULL,
            name TEXT NOT NULL,
            description TEXT NOT NULL,
            date_created TEXT NOT NULL,
            date_updated TEXT NOT NULL
        );
    `;
}

/** Backfills any columns missing from an existing `programs` table (see migrateMembersTable). */
async function migrateProgramsTable(db: SQLiteDatabase): Promise<void> {
    const existingColumns = await db.getAllAsync<{ name: string }>(`PRAGMA table_info(programs)`);
    const existingNames = new Set(existingColumns.map((column) => column.name));
    for (const [name, definition] of PROGRAMS_COLUMNS) {
        if (!existingNames.has(name)) {
            await db.execAsync(`ALTER TABLE programs ADD COLUMN ${name} ${definition};`);
        }
    }
}

// Columns the `exercises` table must have, with the DEFAULT used when backfilling a column
// onto a table created by an earlier schema version. `program_id` is '' while an exercise isn't
// assigned to a program (an exercise belongs to at most one program).
const EXERCISES_COLUMNS: [name: string, definition: string][] = [
    ['name', "TEXT NOT NULL DEFAULT ''"],
    ['description', "TEXT NOT NULL DEFAULT ''"],
    ['muscle_group', "TEXT NOT NULL DEFAULT 'Other'"],
    ['program_id', "TEXT NOT NULL DEFAULT ''"],
    ['date_created', "TEXT NOT NULL DEFAULT ''"],
    ['date_updated', "TEXT NOT NULL DEFAULT ''"],
];

function createExercisesTableSql(table: string): string {
    return `
        CREATE TABLE IF NOT EXISTS ${table} (
            id TEXT PRIMARY KEY NOT NULL,
            name TEXT NOT NULL,
            description TEXT NOT NULL,
            muscle_group TEXT NOT NULL,
            program_id TEXT NOT NULL DEFAULT '',
            date_created TEXT NOT NULL,
            date_updated TEXT NOT NULL
        );
    `;
}

/** Backfills any columns missing from an existing `exercises` table (see migrateMembersTable). */
async function migrateExercisesTable(db: SQLiteDatabase): Promise<void> {
    const existingColumns = await db.getAllAsync<{ name: string }>(`PRAGMA table_info(exercises)`);
    const existingNames = new Set(existingColumns.map((column) => column.name));
    for (const [name, definition] of EXERCISES_COLUMNS) {
        if (!existingNames.has(name)) {
            await db.execAsync(`ALTER TABLE exercises ADD COLUMN ${name} ${definition};`);
        }
    }
}

// Columns the `notifications` table must have, with the DEFAULT used when backfilling a column
// onto a table created by an earlier schema version.
const NOTIFICATIONS_COLUMNS: [name: string, definition: string][] = [
    ['header', "TEXT NOT NULL DEFAULT ''"],
    ['subheader', "TEXT NOT NULL DEFAULT ''"],
    ['is_read', 'INTEGER NOT NULL DEFAULT 0'],
    ['date_created', "TEXT NOT NULL DEFAULT ''"],
    ['date_updated', "TEXT NOT NULL DEFAULT ''"],
];

function createNotificationsTableSql(table: string): string {
    return `
        CREATE TABLE IF NOT EXISTS ${table} (
            id TEXT PRIMARY KEY NOT NULL,
            header TEXT NOT NULL,
            subheader TEXT NOT NULL,
            is_read INTEGER NOT NULL DEFAULT 0,
            date_created TEXT NOT NULL,
            date_updated TEXT NOT NULL
        );
    `;
}

/** Backfills any columns missing from an existing `notifications` table (see migrateMembersTable). */
async function migrateNotificationsTable(db: SQLiteDatabase): Promise<void> {
    const existingColumns = await db.getAllAsync<{ name: string }>(`PRAGMA table_info(notifications)`);
    const existingNames = new Set(existingColumns.map((column) => column.name));
    for (const [name, definition] of NOTIFICATIONS_COLUMNS) {
        if (!existingNames.has(name)) {
            await db.execAsync(`ALTER TABLE notifications ADD COLUMN ${name} ${definition};`);
        }
    }
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
        INSERT INTO members_new (id, first_name, last_name, payment_date, payment_amount, subscription_expiration_date, plan, date_created, date_updated, is_deleted)
        SELECT id, ${firstName}, ${lastName}, payment_date, payment_amount, subscription_expiration_date, plan, date_created, date_updated, is_deleted
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
            await db.execAsync(createEquipmentTableSql('equipment'));
            await migrateEquipmentTable(db);
            await db.execAsync(createContactsTableSql('contacts'));
            await migrateContactsTable(db);
            await db.execAsync(createLockerKeysTableSql('locker_keys'));
            await migrateLockerKeysTable(db);
            await db.execAsync(createAuditLogsTableSql('audit_logs'));
            await migrateAuditLogsTable(db);
            await db.execAsync(createAttendanceRecordsTableSql('attendance_records'));
            await migrateAttendanceRecordsTable(db);
            await db.execAsync(createProgramsTableSql('programs'));
            await migrateProgramsTable(db);
            await db.execAsync(createExercisesTableSql('exercises'));
            await migrateExercisesTable(db);
            await db.execAsync(createNotificationsTableSql('notifications'));
            await migrateNotificationsTable(db);
            return db;
        });
    }
    return dbPromise;
}
