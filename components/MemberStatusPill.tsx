import Pill from './Pill';
import type { Member } from '../models/Member';
import { getMemberStatus, MEMBER_STATUS_LABELS, type MemberStatus } from '../utils/memberStatus';

const STATUS_VARIANTS: Record<MemberStatus, 'success' | 'warning' | 'danger'> = {
    active: 'success',
    expired: 'warning',
    inactive: 'danger',
};

type MemberStatusPillProps = {
    member: Member;
};

export default function MemberStatusPill({ member }: MemberStatusPillProps) {
    const status = getMemberStatus(member);
    return <Pill label={MEMBER_STATUS_LABELS[status]} variant={STATUS_VARIANTS[status]} />;
}
