import type { Member, MembershipPlan } from '../models/Member';
import { nowInPhilippineTime } from './dateTime';
import { getMemberStatus, type MemberStatus } from './memberStatus';

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
    return MEMBERSHIP_PLANS.map((plan) => {
        const inPlan = members.filter((member) => member.plan === plan);
        return {
            plan,
            count: inPlan.length,
            earned: inPlan.reduce((sum, member) => sum + (member.payment_amount ?? 0), 0),
        };
    });
}
