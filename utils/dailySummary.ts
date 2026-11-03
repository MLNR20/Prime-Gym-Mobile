import AsyncStorage from '@react-native-async-storage/async-storage';
import { attendanceRepository, memberRepository } from '../repositories/activeRepositories';
import { formatDateOnly, nowInPhilippineTime } from './dateTime';
import { formatPeso } from './currency';
import { loadNotificationSettings } from './notificationSettings';
import { notify } from './notify';

const SUMMARIZED_KEY = 'daily-summary-last-date';

let running: Promise<void> | null = null;

/**
 * On the first check of a new day, adds one inbox notification summarizing the previous day's check-ins and
 * earnings. Does nothing while Daily Summary is off in Settings, and stays quiet for a day with no activity.
 */
export function notifyDailySummary(): Promise<void> {
    if (!running) {
        running = run().finally(() => {
            running = null;
        });
    }
    return running;
}

async function run(): Promise<void> {
    if (!(await loadNotificationSettings()).daily) return;

    const today = nowInPhilippineTime().slice(0, 10);
    const yesterday = new Date(`${today}T00:00:00Z`);
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);
    const day = yesterday.toISOString().slice(0, 10);

    try {
        if ((await AsyncStorage.getItem(SUMMARIZED_KEY)) === day) return;
    } catch {
        // Storage unavailable: fall through and risk repeating the summary.
    }

    const [records, members] = await Promise.all([attendanceRepository.getAll(), memberRepository.getAll()]);
    const checkIns = records.filter((record) => record.time_in.startsWith(day)).length;
    const payments = members.filter((member) => !member.is_deleted && member.payment_date.startsWith(day));
    const earned = payments.reduce((sum, member) => sum + (member.payment_amount ?? 0), 0);

    if (checkIns > 0 || payments.length > 0) {
        await notify(
            'Daily summary',
            `${formatDateOnly(day)}: ${checkIns} check-in${checkIns === 1 ? '' : 's'}, ${formatPeso(earned)} earned from ${payments.length} payment${payments.length === 1 ? '' : 's'}.`
        );
    }

    try {
        await AsyncStorage.setItem(SUMMARIZED_KEY, day);
    } catch {
        // Storage unavailable: the summary may repeat on the next check.
    }
}
