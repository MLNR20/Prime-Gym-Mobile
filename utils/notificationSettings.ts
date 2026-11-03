import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type NotificationSettings = {
    /** Also show each new inbox notification as an alert on this device. */
    push: boolean;
    /** Remind 7 days before a subscription ends, and announce it once it has. */
    expiry: boolean;
    /** Once a day, summarize the previous day's check-ins and earnings. */
    daily: boolean;
};

const STORAGE_KEY = 'notification-settings';

// Push starts off because turning it on is what asks the device for permission (see SettingsScreen).
export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = { push: false, expiry: true, daily: false };

export async function loadNotificationSettings(): Promise<NotificationSettings> {
    try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        return raw ? { ...DEFAULT_NOTIFICATION_SETTINGS, ...JSON.parse(raw) } : DEFAULT_NOTIFICATION_SETTINGS;
    } catch {
        return DEFAULT_NOTIFICATION_SETTINGS;
    }
}

const listeners = new Set<(settings: NotificationSettings) => void>();

export async function saveNotificationSettings(changes: Partial<NotificationSettings>): Promise<NotificationSettings> {
    const next = { ...(await loadNotificationSettings()), ...changes };
    try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
        // Storage unavailable: the change still applies to this session's listeners.
    }
    listeners.forEach((listener) => listener(next));
    return next;
}

/** The saved notification settings (defaults until loaded), and a setter that saves and shares the change app-wide. */
export function useNotificationSettings() {
    const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_NOTIFICATION_SETTINGS);

    useEffect(() => {
        let cancelled = false;
        loadNotificationSettings().then((loaded) => {
            if (!cancelled) setSettings(loaded);
        });
        listeners.add(setSettings);
        return () => {
            cancelled = true;
            listeners.delete(setSettings);
        };
    }, []);

    const update = useCallback((changes: Partial<NotificationSettings>) => saveNotificationSettings(changes), []);
    return { settings, update };
}
