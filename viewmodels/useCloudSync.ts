import { useEffect } from 'react';
import { AppState } from 'react-native';
import { syncAllRepositories } from '../repositories/SyncedRepository';

const RESYNC_INTERVAL_MS = 5 * 60 * 1000;

/** Syncs with the cloud on launch, on returning to the app, and every few minutes while it stays open. */
export function useCloudSync() {
    useEffect(() => {
        const sync = () => {
            syncAllRepositories(true).catch((err) => console.warn('[sync]', err));
        };

        sync();
        const interval = setInterval(sync, RESYNC_INTERVAL_MS);
        const subscription = AppState.addEventListener('change', (state) => {
            if (state === 'active') sync();
        });

        return () => {
            clearInterval(interval);
            subscription.remove();
        };
    }, []);
}
