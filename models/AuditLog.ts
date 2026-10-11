export type AuditLog = {
    id: string;
    /** Who or what the action relates to, e.g. a member's name or a locker number. */
    reference: string;
    /** Short description of what happened, e.g. "Added new subscriber". */
    action: string;
    date_created: string;
    date_updated: string;
};

export type NewAuditLog = Omit<AuditLog, 'id'>;
