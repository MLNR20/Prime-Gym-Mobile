import type { Equipment, NewEquipment } from '../models/Equipment';
import type { Member, NewMember } from '../models/Member';
import { mirroredMemberRepository } from './MirroredMemberRepository';
import type { Repository } from './Repository';
import { sqliteEquipmentRepository } from './SqliteEquipmentRepository';

// SQLite is the source of truth; new members are also mirrored to Firestore for a cloud backup
// (see MirroredMemberRepository). ViewModels depend on the Repository<T> interface only, so
// swapping to a fully Firestore-backed repository later needs no other changes.
export const memberRepository: Repository<Member, NewMember> = mirroredMemberRepository;

// Equipment is local-only (no Firestore backup) for now.
export const equipmentRepository: Repository<Equipment, NewEquipment> = sqliteEquipmentRepository;
