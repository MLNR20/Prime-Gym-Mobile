import type { AttendanceRecord, NewAttendanceRecord } from '../models/AttendanceRecord';
import type { AuditLog, NewAuditLog } from '../models/AuditLog';
import type { Contact, NewContact } from '../models/Contact';
import type { Equipment, NewEquipment } from '../models/Equipment';
import type { Exercise, NewExercise } from '../models/Exercise';
import type { LockerKey, NewLockerKey } from '../models/LockerKey';
import type { Member, NewMember } from '../models/Member';
import type { NewNotification, Notification } from '../models/Notification';
import type { NewPlan, Plan } from '../models/Plan';
import type { NewProgram, Program } from '../models/Program';
import { FirestoreCollection } from './FirestoreCollection';
import type { Repository } from './Repository';
import { sqliteAttendanceRepository } from './SqliteAttendanceRepository';
import { sqliteAuditLogRepository } from './SqliteAuditLogRepository';
import { sqliteContactRepository } from './SqliteContactRepository';
import { sqliteEquipmentRepository } from './SqliteEquipmentRepository';
import { sqliteExerciseRepository } from './SqliteExerciseRepository';
import { sqliteLockerKeyRepository } from './SqliteLockerKeyRepository';
import { sqliteMemberRepository } from './SqliteMemberRepository';
import { sqliteNotificationRepository } from './SqliteNotificationRepository';
import { sqlitePlanRepository } from './SqlitePlanRepository';
import { sqliteProgramRepository } from './SqliteProgramRepository';
import { SyncedRepository } from './SyncedRepository';

// SQLite on each phone is what the screens read. Tables listed as synced below are also kept in step with
// Firestore in both directions (see SyncedRepository), so every phone signed in to the gym sees the same data.
// ViewModels depend on the Repository<T> interface only, so none of them know about the sync.
export const memberRepository: Repository<Member, NewMember> = new SyncedRepository(
    sqliteMemberRepository,
    new FirestoreCollection<Member>('members'),
    'members'
);

export const equipmentRepository: Repository<Equipment, NewEquipment> = new SyncedRepository(
    sqliteEquipmentRepository,
    new FirestoreCollection<Equipment>('equipment'),
    'equipment'
);

export const contactRepository: Repository<Contact, NewContact> = new SyncedRepository(
    sqliteContactRepository,
    new FirestoreCollection<Contact>('contacts'),
    'contacts'
);

export const lockerKeyRepository: Repository<LockerKey, NewLockerKey> = new SyncedRepository(
    sqliteLockerKeyRepository,
    new FirestoreCollection<LockerKey>('locker_keys'),
    'locker_keys'
);

export const attendanceRepository: Repository<AttendanceRecord, NewAttendanceRecord> = new SyncedRepository(
    sqliteAttendanceRepository,
    new FirestoreCollection<AttendanceRecord>('attendance_records'),
    'attendance_records'
);

export const auditLogRepository: Repository<AuditLog, NewAuditLog> = new SyncedRepository(
    sqliteAuditLogRepository,
    new FirestoreCollection<AuditLog>('audit_logs'),
    'audit_logs'
);

export const exerciseRepository: Repository<Exercise, NewExercise> = new SyncedRepository(
    sqliteExerciseRepository,
    new FirestoreCollection<Exercise>('exercises'),
    'exercises'
);

export const programRepository: Repository<Program, NewProgram> = new SyncedRepository(
    sqliteProgramRepository,
    new FirestoreCollection<Program>('programs'),
    'programs'
);

// Local to each phone: the inbox (every phone raises its own alerts) and membership plans (each phone seeds
// its own default Basic/Standard/Premium, which would show up twice if they were synced).
export const notificationRepository: Repository<Notification, NewNotification> = sqliteNotificationRepository;
export const planRepository: Repository<Plan, NewPlan> = sqlitePlanRepository;
