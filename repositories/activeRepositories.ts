import type { Member, NewMember } from '../models/Member';
import { mirroredMemberRepository } from './MirroredMemberRepository';
import type { Repository } from './Repository';

// SQLite is the source of truth; new members are also mirrored to Firestore for a cloud backup
// (see MirroredMemberRepository). ViewModels depend on the Repository<T> interface only, so
// swapping to a fully Firestore-backed repository later needs no other changes.
export const memberRepository: Repository<Member, NewMember> = mirroredMemberRepository;
