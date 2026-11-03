import { useEffect } from 'react';
import { AppState } from 'react-native';
import { notifyDailySummary } from '../utils/dailySummary';
import { notifyExpiredSubscriptions } from '../utils/expiredSubscriptions';
import { useNotificationSettings } from '../utils/notificationSettings';

const RECHECK_INTERVAL_MS = 60 * 60 * 1000;

/**
 * Adds subscription and daily-summary notifications on launch, on returning to the app, hourly while it stays open,
 * and right away when a Notifications toggle in Settings changes.
 */
export function useExpiredSubscriptionNotifier() {
    const { settings } = useNotificationSettings();

    useEffect(() => {
        const check = () => {
            notifyExpiredSubscriptions().catch((err) => console.warn('[expiry]', err));
            notifyDailySummary().catch((err) => console.warn('[daily-summary]', err));
        };

        check();
        const interval = setInterval(check, RECHECK_INTERVAL_MS);
        const subscription = AppState.addEventListener('change', (state) => {
            if (state === 'active') check();
        });

        return () => {
            clearInterval(interval);
            subscription.remove();
        };
    }, [settings.expiry, settings.daily]);
}
