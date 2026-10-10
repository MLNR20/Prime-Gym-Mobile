import type { Member } from '../models/Member';
import { nowInPhilippineTime } from './dateTime';

export type MemberStatus = 'active' | 'expired' | 'inactive';

export const MEMBER_STATUS_LABELS: Record<MemberStatus, string> = {
    active: 'Active',
    expired: 'Expired',
    inactive: 'Inactive',
};

/** Active = not deleted and subscription not yet expired; Expired = not deleted but past expiration; Inactive = soft-deleted. */
export function getMemberStatus(member: Member): MemberStatus {
    if (member.is_deleted) return 'inactive';
    const today = nowInPhilippineTime().slice(0, 10);
    return member.subscription_expiration_date >= today ? 'active' : 'expired';
}
