import type { AttendanceRecord, NewAttendanceRecord } from '../models/AttendanceRecord';
import type { AuditLog, NewAuditLog } from '../models/AuditLog';
import type { Contact, NewContact } from '../models/Contact';
import type { Equipment, NewEquipment } from '../models/Equipment';
import type { Exercise, NewExercise } from '../models/Exercise';
import type { LockerKey, NewLockerKey } from '../models/LockerKey';
import type { Member, NewMember } from '../models/Member';
import type { NewNotification, Notification } from '../models/Notification';
import type { NewProgram, Program } from '../models/Program';
import { mirroredAttendanceRepository } from './MirroredAttendanceRepository';
import { mirroredAuditLogRepository } from './MirroredAuditLogRepository';
import { mirroredContactRepository } from './MirroredContactRepository';
import { mirroredExerciseRepository } from './MirroredExerciseRepository';
import { mirroredLockerKeyRepository } from './MirroredLockerKeyRepository';
import { mirroredMemberRepository } from './MirroredMemberRepository';
import { mirroredProgramRepository } from './MirroredProgramRepository';
import type { Repository } from './Repository';
import { sqliteEquipmentRepository } from './SqliteEquipmentRepository';
import { sqliteNotificationRepository } from './SqliteNotificationRepository';

// SQLite is the source of truth; new members are also mirrored to Firestore for a cloud backup
// (see MirroredMemberRepository). ViewModels depend on the Repository<T> interface only, so
// swapping to a fully Firestore-backed repository later needs no other changes.
export const memberRepository: Repository<Member, NewMember> = mirroredMemberRepository;

// Equipment is local-only (no Firestore backup) for now.
export const equipmentRepository: Repository<Equipment, NewEquipment> = sqliteEquipmentRepository;

// Notifications are local-only (no Firestore backup) for now, same as equipment.
export const notificationRepository: Repository<Notification, NewNotification> = sqliteNotificationRepository;

// Contacts and locker keys are mirrored to Firestore for a cloud backup, same as members.
export const contactRepository: Repository<Contact, NewContact> = mirroredContactRepository;
export const lockerKeyRepository: Repository<LockerKey, NewLockerKey> = mirroredLockerKeyRepository;

// Attendance records are mirrored to Firestore too, including later edits such as filling in time_out.
export const attendanceRepository: Repository<AttendanceRecord, NewAttendanceRecord> = mirroredAttendanceRepository;

// Audit logs are mirrored to Firestore for a cloud backup, same as members, contacts and locker keys.
export const auditLogRepository: Repository<AuditLog, NewAuditLog> = mirroredAuditLogRepository;

// Exercises and programs are mirrored to Firestore for a cloud backup, including updates and removals.
export const exerciseRepository: Repository<Exercise, NewExercise> = mirroredExerciseRepository;
export const programRepository: Repository<Program, NewProgram> = mirroredProgramRepository;
