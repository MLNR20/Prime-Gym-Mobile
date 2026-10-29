import { notificationRepository } from '../repositories/activeRepositories';
import { nowInPhilippineTime } from './dateTime';

/** Adds an unread notification to the inbox, e.g. notify('Subscription expiring', 'Juan Dela Cruz expires in 7 days'). */
export function notify(header: string, subheader: string) {
    const timestamp = nowInPhilippineTime();
    return notificationRepository.add({
        header,
        subheader,
        is_read: false,
        date_created: timestamp,
        date_updated: timestamp,
    });
}
