export type MembershipPlan = 'Basic' | 'Standard' | 'Premium';

export type Member = {
    id: string;
    first_name: string;
    last_name: string;
    payment_date: string;
    subscription_expiration_date: string;
    plan: MembershipPlan;
    date_created: string;
    date_updated: string;
    is_deleted: boolean;
};

export type NewMember = Omit<Member, 'id'>;
