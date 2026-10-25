import type { AuditLog, NewAuditLog } from '../models/AuditLog';
import type { Contact, NewContact } from '../models/Contact';
import type { Equipment, NewEquipment } from '../models/Equipment';
import type { LockerKey, NewLockerKey } from '../models/LockerKey';
import type { Member, NewMember } from '../models/Member';
import { mirroredAuditLogRepository } from './MirroredAuditLogRepository';
import { mirroredContactRepository } from './MirroredContactRepository';
import { mirroredLockerKeyRepository } from './MirroredLockerKeyRepository';
import { mirroredMemberRepository } from './MirroredMemberRepository';
import type { Repository } from './Repository';
import { sqliteEquipmentRepository } from './SqliteEquipmentRepository';

// SQLite is the source of truth; new members are also mirrored to Firestore for a cloud backup
// (see MirroredMemberRepository). ViewModels depend on the Repository<T> interface only, so
// swapping to a fully Firestore-backed repository later needs no other changes.
export const memberRepository: Repository<Member, NewMember> = mirroredMemberRepository;

// Equipment is local-only (no Firestore backup) for now.
export const equipmentRepository: Repository<Equipment, NewEquipment> = sqliteEquipmentRepository;

// Contacts and locker keys are mirrored to Firestore for a cloud backup, same as members.
export const contactRepository: Repository<Contact, NewContact> = mirroredContactRepository;
export const lockerKeyRepository: Repository<LockerKey, NewLockerKey> = mirroredLockerKeyRepository;

// Audit logs are mirrored to Firestore for a cloud backup, same as members, contacts and locker keys.
export const auditLogRepository: Repository<AuditLog, NewAuditLog> = mirroredAuditLogRepository;
