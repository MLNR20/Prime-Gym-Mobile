import type { Member, MembershipPlan } from '../models/Member';
import { nowInPhilippineTime } from './dateTime';
import { getMemberStatus, type MemberStatus } from './memberStatus';

// Plans always listed in the breakdowns; any other plan a subscriber is on (added in Settings) is appended.
export const MEMBERSHIP_PLANS: MembershipPlan[] = ['Basic', 'Standard', 'Premium'];

export type PlanBreakdown = {
    plan: MembershipPlan;
    count: number;
    earned: number;
};

export type FinanceSummary = {
    totalEarned: number;
    earnedThisMonth: number;
    paymentCount: number;
    /** Subscription payments, newest first. */
    payments: Member[];
    byPlan: PlanBreakdown[];
};

export type PaymentPeriod = 'all' | 'today' | 'week' | 'month' | 'year';

export const PAYMENT_PERIODS: readonly { value: PaymentPeriod; label: string }[] = [
    { value: 'all', label: 'All time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'Last 7 days' },
    { value: 'month', label: 'This month' },
    { value: 'year', label: 'This year' },
];

export type PaymentFilters = {
    /** Matches the subscriber's name or plan, ignoring case. */
    query: string;
    period: PaymentPeriod;
    /** A plan name, or '' for every plan. */
    plan: string;
};

export const NO_PAYMENT_FILTERS: PaymentFilters = { query: '', period: 'all', plan: '' };

export function hasPaymentFilters({ query, period, plan }: PaymentFilters): boolean {
    return query.trim() !== '' || period !== 'all' || plan !== '';
}

/** First day (YYYY-MM-DD) included in a period, or '' when it has no lower bound. */
function periodStart(period: PaymentPeriod, today: string): string {
    switch (period) {
        case 'today':
            return today;
        case 'week': {
            const date = new Date(`${today}T00:00:00Z`);
            date.setUTCDate(date.getUTCDate() - 6);
            return date.toISOString().slice(0, 10);
        }
        case 'month':
            return `${today.slice(0, 7)}-01`;
        case 'year':
            return `${today.slice(0, 4)}-01-01`;
        default:
            return '';
    }
}

/** Keeps the subscribers whose latest payment matches the search text, the period and the plan. */
export function filterPayments(members: Member[], filters: PaymentFilters): Member[] {
    const today = nowInPhilippineTime().slice(0, 10);
    const start = periodStart(filters.period, today);
    const query = filters.query.trim().toLowerCase();

    return members.filter((member) => {
        const paid = member.payment_date.slice(0, 10);
        if (start && (paid < start || paid > today)) return false;
        if (filters.plan && member.plan !== filters.plan) return false;
        if (!query) return true;
        return `${member.first_name} ${member.last_name} ${member.plan}`.toLowerCase().includes(query);
    });
}

export type SubscriberBreakdown = {
    total: number;
    byStatus: Record<MemberStatus, number>;
    /** Plan counts among subscribers that haven't been removed (soft-deleted). */
    byPlan: PlanBreakdown[];
    /** Active subscribers whose subscription ends within the next 7 days. */
    expiringSoon: number;
};

/**
 * Each subscriber stores a single (latest) payment, so earnings are the sum of those payments.
 * Removed (soft-deleted) subscribers are left out.
 */
export function summarizeFinance(members: Member[]): FinanceSummary {
    const thisMonth = nowInPhilippineTime().slice(0, 7);
    const payments = members
        .filter((member) => !member.is_deleted)
        .sort((a, b) => b.payment_date.localeCompare(a.payment_date));
    const amountOf = (member: Member) => member.payment_amount ?? 0;
    return {
        totalEarned: payments.reduce((sum, member) => sum + amountOf(member), 0),
        earnedThisMonth: payments
            .filter((member) => member.payment_date.startsWith(thisMonth))
            .reduce((sum, member) => sum + amountOf(member), 0),
        paymentCount: payments.length,
        payments,
        byPlan: breakdownByPlan(payments),
    };
}

export function summarizeSubscribers(members: Member[]): SubscriberBreakdown {
    const today = nowInPhilippineTime().slice(0, 10);
    const weekAhead = new Date(`${today}T00:00:00Z`);
    weekAhead.setUTCDate(weekAhead.getUTCDate() + 7);
    const weekAheadDate = weekAhead.toISOString().slice(0, 10);

    const byStatus: Record<MemberStatus, number> = { active: 0, expired: 0, inactive: 0 };
    let expiringSoon = 0;
    for (const member of members) {
        const status = getMemberStatus(member);
        byStatus[status] += 1;
        if (status === 'active' && member.subscription_expiration_date <= weekAheadDate) expiringSoon += 1;
    }
    return {
        total: members.length,
        byStatus,
        byPlan: breakdownByPlan(members.filter((member) => !member.is_deleted)),
        expiringSoon,
    };
}

function breakdownByPlan(members: Member[]): PlanBreakdown[] {
    const plans = [...new Set([...MEMBERSHIP_PLANS, ...members.map((member) => member.plan)])];
    return plans.map((plan) => {
        const inPlan = members.filter((member) => member.plan === plan);
        return {
            plan,
            count: inPlan.length,
            earned: inPlan.reduce((sum, member) => sum + (member.payment_amount ?? 0), 0),
        };
    });
}
