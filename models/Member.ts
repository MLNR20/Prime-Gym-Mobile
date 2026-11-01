// The name of a plan from Settings > Membership Plans (Basic, Standard and Premium by default).
export type MembershipPlan = string;

export type Member = {
    id: string;
    first_name: string;
    last_name: string;
    payment_date: string;
    payment_amount: number;
    subscription_expiration_date: string;
    plan: MembershipPlan;
    /** Program the subscriber is assigned to; '' while unassigned (a subscriber has at most one program). */
    program_id: string;
    date_created: string;
    date_updated: string;
    is_deleted: boolean;
};

export type NewMember = Omit<Member, 'id'>;
