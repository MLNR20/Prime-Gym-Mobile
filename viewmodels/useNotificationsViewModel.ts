import { useEffect, useMemo, useState } from 'react';
import type { Notification } from '../models/Notification';
import { notificationRepository } from '../repositories/activeRepositories';
import { nowInPhilippineTime } from '../utils/dateTime';

/** Live count of unread notifications, e.g. for the inbox tab badge. */
export function useUnreadNotificationCount() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        return notificationRepository.subscribe(
            (data) => setCount(data.filter((item) => !item.is_read).length),
            () => setCount(0)
        );
    }, []);

    return count;
}

export function useNotificationsViewModel() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = notificationRepository.subscribe(
            (data) => {
                setNotifications(data);
                setLoading(false);
            },
            (err) => {
                setError(err.message);
                setLoading(false);
            }
        );
        return unsubscribe;
    }, []);

    const filteredNotifications = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();
        if (!normalizedQuery) return notifications;
        return notifications.filter(
            (item) =>
                item.header.toLowerCase().includes(normalizedQuery) ||
                item.subheader.toLowerCase().includes(normalizedQuery)
        );
    }, [notifications, query]);

    const unreadCount = useMemo(() => notifications.filter((item) => !item.is_read).length, [notifications]);

    const toggleRead = (item: Notification) =>
        notificationRepository.update(item.id, { is_read: !item.is_read, date_updated: nowInPhilippineTime() });

    const markAllRead = async () => {
        const timestamp = nowInPhilippineTime();
        for (const item of notifications.filter((entry) => !entry.is_read)) {
            await notificationRepository.update(item.id, { is_read: true, date_updated: timestamp });
        }
    };

    const removeNotification = (item: Notification) => notificationRepository.remove(item.id);

    return {
        notifications: filteredNotifications,
        query,
        setQuery,
        loading,
        error,
        unreadCount,
        toggleRead,
        markAllRead,
        removeNotification,
    };
}
