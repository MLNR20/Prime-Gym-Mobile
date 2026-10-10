export type LockerKeyStatus = 'Available' | 'Assigned' | 'Lost';

export type LockerKey = {
    id: string;
    locker_number: string;
    key_code: string;
    status: LockerKeyStatus;
    assigned_to: string;
    date_created: string;
    date_updated: string;
};

export type NewLockerKey = Omit<LockerKey, 'id'>;
