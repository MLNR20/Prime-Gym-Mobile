export type AttendanceRecord = {
    id: string;
    memberId: string;
    /** yyyy-mm-dd, so a member has at most one record per day */
    date: string;
    checkedInAt: number;
};
