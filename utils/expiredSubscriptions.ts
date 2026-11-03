import AsyncStorage from '@react-native-async-storage/async-storage';
import { memberRepository } from '../repositories/activeRepositories';
import { formatDateOnly, nowInPhilippineTime } from './dateTime';
import { loadNotificationSettings } from './notificationSettings';
import { notify } from './notify';

const EXPIRED_KEY = 'expired-subscription-notified';
const EXPIRING_KEY = 'expiring-subscription-notified';
// Only subscriptions that lapsed recently are announced, so a first run doesn't flood the inbox with old expiries.
const NOTIFY_WINDOW_DAYS = 7;
// How far ahead a subscription ending soon is announced.
const REMIND_DAYS_BEFORE = 7;

function shiftDate(isoDate: string, days: number): string {
    const date = new Date(`${isoDate}T00:00:00Z`);
    date.setUTCDate(date.getUTCDate() + days);
    return date.toISOString().slice(0, 10);
}

function daysUntil(isoDate: string, from: string): number {
    return Math.round((Date.parse(`${isoDate}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86_400_000);
}

// Remembers which expiration date was announced per member, so deleting a notification doesn't bring it back
// but a renewed subscription that expires again (new date) is announced again.
async function loadNotified(key: string): Promise<Record<string, string>> {
    try {
        const raw = await AsyncStorage.getItem(key);
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
}

async function saveNotified(key: string, notified: Record<string, string>) {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(notified));
    } catch {
        // Storage unavailable: worst case the next check announces the same subscriptions again.
    }
}

let running: Promise<void> | null = null;

/**
 * Adds inbox notifications for subscriptions that are about to end (within 7 days) or have just expired.
 * Does nothing while Expiring Subscriptions is off in Settings.
 */
export function notifyExpiredSubscriptions(): Promise<void> {
    // Concurrent triggers (mount + app resume) share one run so the same member is never announced twice.
    if (!running) {
        running = run().finally(() => {
            running = null;
        });
    }
    return running;
}

async function run(): Promise<void> {
    if (!(await loadNotificationSettings()).expiry) return;

    const today = nowInPhilippineTime().slice(0, 10);
    const oldest = shiftDate(today, -NOTIFY_WINDOW_DAYS);
    const soonest = shiftDate(today, REMIND_DAYS_BEFORE);
    const members = await memberRepository.getAll();
    const expired = await loadNotified(EXPIRED_KEY);
    const expiring = await loadNotified(EXPIRING_KEY);
    let expiredChanged = false;
    let expiringChanged = false;

    for (const member of members) {
        const expiration = member.subscription_expiration_date;
        if (member.is_deleted || !expiration) continue;
        const name = `${member.first_name} ${member.last_name}`;

        if (expiration < today) {
            if (expiration < oldest || expired[member.id] === expiration) continue;
            await notify('Subscription expired', `${name}'s ${member.plan} subscription expired on ${formatDateOnly(expiration)}.`);
            expired[member.id] = expiration;
            expiredChanged = true;
        } else if (expiration <= soonest && expiring[member.id] !== expiration) {
            const days = daysUntil(expiration, today);
            const when = days === 0 ? 'today' : days === 1 ? 'tomorrow' : `in ${days} days`;
            await notify('Subscription expiring', `${name}'s ${member.plan} subscription expires ${when} (${formatDateOnly(expiration)}).`);
            expiring[member.id] = expiration;
            expiringChanged = true;
        }
    }

    if (expiredChanged) await saveNotified(EXPIRED_KEY, expired);
    if (expiringChanged) await saveNotified(EXPIRING_KEY, expiring);
}
