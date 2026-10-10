import type { LockerKeyStatus } from '../models/LockerKey';

export const LOCKER_KEY_STATUSES: LockerKeyStatus[] = ['Available', 'Assigned', 'Lost'];

export const LOCKER_KEY_STATUS_LABELS: Record<LockerKeyStatus, string> = {
    Available: 'Available',
    Assigned: 'Assigned',
    Lost: 'Lost',
};
