import { useEffect } from 'react';
import { AppState } from 'react-native';
import { notifyExpiredSubscriptions } from '../utils/expiredSubscriptions';

const RECHECK_INTERVAL_MS = 60 * 60 * 1000;

/** Checks for newly expired member subscriptions on launch, on returning to the app, and hourly while it stays open. */
export function useExpiredSubscriptionNotifier() {
    useEffect(() => {
        const check = () => {
            notifyExpiredSubscriptions().catch((err) => console.warn('[expiry]', err));
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
    }, []);
}
