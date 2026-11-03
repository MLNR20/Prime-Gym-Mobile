import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

const ANDROID_CHANNEL = 'default';

// Without a handler, a notification that arrives while the app is open is not shown.
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

const isWeb = Platform.OS === 'web';

/** Asks the user for permission to show alerts on this device. Resolves to whether alerts are allowed. */
export async function requestDeviceAlertPermission(): Promise<boolean> {
    try {
        if (isWeb) {
            if (typeof Notification === 'undefined') return false;
            return (await Notification.requestPermission()) === 'granted';
        }
        if (Platform.OS === 'android') {
            // Android 13+ shows no permission prompt until a channel exists.
            await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL, {
                name: 'Prime Gym',
                importance: Notifications.AndroidImportance.HIGH,
            });
        }
        const current = await Notifications.getPermissionsAsync();
        if (current.granted) return true;
        if (!current.canAskAgain) return false;
        return (await Notifications.requestPermissionsAsync({ ios: { allowAlert: true, allowBadge: true, allowSound: true } })).granted;
    } catch (err) {
        console.warn('[device-alerts]', err);
        return false;
    }
}

/** Shows an alert on this device right away, if the user has allowed them. Never throws. */
export async function showDeviceAlert(title: string, body: string): Promise<void> {
    try {
        if (isWeb) {
            if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
                new Notification(title, { body });
            }
            return;
        }
        if (!(await Notifications.getPermissionsAsync()).granted) return;
        await Notifications.scheduleNotificationAsync({ content: { title, body }, trigger: null });
    } catch (err) {
        console.warn('[device-alerts]', err);
    }
}
