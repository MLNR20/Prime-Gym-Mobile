import { notificationRepository } from '../repositories/activeRepositories';
import { nowInPhilippineTime } from './dateTime';
import { showDeviceAlert } from './deviceAlerts';
import { loadNotificationSettings } from './notificationSettings';

/**
 * Adds an unread notification to the inbox, e.g. notify('Subscription expiring', 'Juan Dela Cruz expires in 7 days'),
 * and also shows it as a device alert when Push Notifications is on in Settings.
 */
export async function notify(header: string, subheader: string) {
    const timestamp = nowInPhilippineTime();
    const created = await notificationRepository.add({
        header,
        subheader,
        is_read: false,
        date_created: timestamp,
        date_updated: timestamp,
    });
    if ((await loadNotificationSettings()).push) await showDeviceAlert(header, subheader);
    return created;
}
