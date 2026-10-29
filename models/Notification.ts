export type Notification = {
    id: string;
    header: string;
    subheader: string;
    is_read: boolean;
    // When the notification was received (also what the inbox shows as its timestamp).
    date_created: string;
    date_updated: string;
};

export type NewNotification = Omit<Notification, 'id'>;
