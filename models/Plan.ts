export type Plan = {
    id: string;
    name: string;
    price: number;
    duration_months: number;
    date_created: string;
    date_updated: string;
};

export type NewPlan = Omit<Plan, 'id'>;
