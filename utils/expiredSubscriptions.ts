import AsyncStorage from '@react-native-async-storage/async-storage';
import { memberRepository } from '../repositories/activeRepositories';
import { formatDateOnly, nowInPhilippineTime } from './dateTime';
import { notify } from './notify';

const NOTIFIED_KEY = 'expired-subscription-notified';
// Only subscriptions that lapsed recently are announced, so a first run doesn't flood the inbox with old expiries.
const NOTIFY_WINDOW_DAYS = 7;

function daysBefore(isoDate: string, days: number): string {
    const date = new Date(`${isoDate}T00:00:00Z`);
    date.setUTCDate(date.getUTCDate() - days);
    return date.toISOString().slice(0, 10);
}

// Remembers which expiration date was announced per member, so deleting a notification doesn't bring it back
// but a renewed subscription that expires again (new date) is announced again.
async function loadNotified(): Promise<Record<string, string>> {
    try {
        const raw = await AsyncStorage.getItem(NOTIFIED_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
}

let running: Promise<void> | null = null;

/** Adds an inbox notification for each member whose subscription has expired since the last check. */
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
    const today = nowInPhilippineTime().slice(0, 10);
    const oldest = daysBefore(today, NOTIFY_WINDOW_DAYS);
    const members = await memberRepository.getAll();
    const notified = await loadNotified();
    let changed = false;

    for (const member of members) {
        const expiration = member.subscription_expiration_date;
        if (member.is_deleted || !expiration || expiration >= today || expiration < oldest) continue;
        if (notified[member.id] === expiration) continue;

        await notify(
            'Subscription expired',
            `${member.first_name} ${member.last_name}'s ${member.plan} subscription expired on ${formatDateOnly(expiration)}.`
        );
        notified[member.id] = expiration;
        changed = true;
    }

    if (changed) {
        try {
            await AsyncStorage.setItem(NOTIFIED_KEY, JSON.stringify(notified));
        } catch {
            // Storage unavailable: worst case the next check announces the same expiries again.
        }
    }
}
