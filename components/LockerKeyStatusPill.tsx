import Pill from './Pill';
import type { LockerKey, LockerKeyStatus } from '../models/LockerKey';
import { LOCKER_KEY_STATUS_LABELS } from '../utils/lockerKeyStatus';

const STATUS_VARIANTS: Record<LockerKeyStatus, 'success' | 'warning' | 'danger'> = {
    Available: 'success',
    Assigned: 'warning',
    Lost: 'danger',
};

type LockerKeyStatusPillProps = {
    lockerKey: LockerKey;
};

export default function LockerKeyStatusPill({ lockerKey }: LockerKeyStatusPillProps) {
    return <Pill label={LOCKER_KEY_STATUS_LABELS[lockerKey.status]} variant={STATUS_VARIANTS[lockerKey.status]} />;
}
