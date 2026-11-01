import type { ReactNode } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ActivityIndicator, List, Text } from 'react-native-paper';
import type { Notification } from '../models/Notification';
import { formatPhilippineTimestamp } from '../utils/dateTime';
import { commonStyles } from './commonStyles';
import { palette, themedStyles } from '../utils/theme';

type NotificationListCardProps = {
    notifications: Notification[];
    loading?: boolean;
    error?: string | null;
    emptyLabel?: string;
    renderRight?: (notification: Notification) => ReactNode;
    onItemPress?: (notification: Notification) => void;
};

export default function NotificationListCard({
    notifications = [],
    loading = false,
    error = null,
    emptyLabel = 'No notifications found.',
    renderRight,
    onItemPress,
}: NotificationListCardProps) {
    return (
        <View style={[commonStyles.listView, styles.flexFill]}>
            {loading && <ActivityIndicator style={styles.spinner} />}
            {!loading && error && (
                <Text style={styles.itemDescription} className="font-poppins text-base">{error}</Text>
            )}
            {!loading && !error && (
                <FlatList
                    style={styles.flexFill}
                    data={notifications}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listItems}
                    renderItem={({ item }) => (
                        <List.Item
                            title={item.header}
                            description={() => (
                                <View style={styles.descriptionGroup}>
                                    <Text style={styles.subheader} className="font-poppins text-sm" numberOfLines={2}>
                                        {item.subheader}
                                    </Text>
                                    <Text style={styles.timestamp} className="font-poppins text-xs">
                                        {formatPhilippineTimestamp(item.date_created)}
                                    </Text>
                                </View>
                            )}
                            titleStyle={[styles.itemTitle, item.is_read && styles.itemTitleRead]}
                            style={[commonStyles.cardForListView, item.is_read && styles.cardRead]}
                            left={() => (
                                <View style={styles.dotWrapper}>
                                    <View style={[styles.dot, item.is_read && styles.dotRead]} />
                                </View>
                            )}
                            onPress={onItemPress ? () => onItemPress(item) : undefined}
                            right={renderRight ? () => renderRight(item) : undefined}
                        />
                    )}
                    ListEmptyComponent={
                        <Text style={styles.itemDescription} className="font-poppins text-base">{emptyLabel}</Text>
                    }
                />
            )}
        </View>
    );
}

const styles = themedStyles(() => StyleSheet.create({
    flexFill: {
        flex: 1,
    },
    listItems: {
        gap: 12,
    },
    itemTitle: commonStyles.cardTitle,
    itemTitleRead: {
        fontFamily: 'Poppins_600SemiBold',
        color: palette.muted,
    },
    cardRead: {
        backgroundColor: palette.background,
    },
    itemDescription: {
        color: palette.brown,
    },
    descriptionGroup: {
        gap: 4,
        marginTop: 4,
    },
    subheader: {
        color: palette.bodyText,
    },
    timestamp: {
        color: palette.subtle,
    },
    dotWrapper: {
        width: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#F59E0B',
    },
    dotRead: {
        backgroundColor: 'transparent',
    },
    spinner: {
        paddingVertical: 12,
    },
}));
