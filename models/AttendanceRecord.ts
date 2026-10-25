export type AttendanceRecord = {
    id: string;
    member_id: string;
    locker_key_id: string;
    /** ISO-8601 timestamp (+08:00), defaults to the moment the record is created. */
    time_in: string;
    /** ISO-8601 timestamp (+08:00), or '' while the member is still checked in. */
    time_out: string;
    date_created: string;
    date_updated: string;
};

export type NewAttendanceRecord = Omit<AttendanceRecord, 'id'>;
