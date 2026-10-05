import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRecentActivityViewModel } from '../viewmodels/useRecentActivityViewModel';
import { formatPhilippineTimestamp } from '../utils/dateTime';

export default function RecentActivityCard({ onViewMembers }: { onViewMembers?: () => void }) {
    const { entries, loading, error } = useRecentActivityViewModel();

    return (
        <View style={styles.container}>
            <Text className="text-lg font-poppins-bold text-black">Recent Activity</Text>
            <View style={styles.card}>
                {loading && <Text style={styles.message}>Loading...</Text>}
                {!loading && error && <Text style={styles.message}>{error}</Text>}
                {!loading && !error && entries.length === 0 && (
                    <Text style={styles.message}>No recent check-ins.</Text>
                )}
                {!loading &&
                    !error &&
                    entries.map((entry, index) => (
                        <View
                            key={entry.id}
                            style={[styles.row, index < entries.length - 1 && styles.rowDivider]}
                        >
                            <View style={styles.iconWrapper}>
                                <Ionicons name="checkmark-done-outline" size={18} color="#FBBF77" />
                            </View>
                            <View style={styles.textGroup}>
                                <Text style={styles.name} numberOfLines={1}>
                                    {entry.memberName}
                                </Text>
                                <Text style={styles.timestamp}>
                                    {formatPhilippineTimestamp(new Date(entry.checkedInAt).toISOString())}
                                </Text>
                            </View>
                        </View>
                    ))}
                <Pressable
                    style={({ pressed }) => [styles.footer, pressed && styles.footerPressed]}
                    onPress={onViewMembers}
                >
                    <View style={styles.iconWrapper}>
                        <Ionicons name="people-outline" size={18} color="#FBBF77" />
                    </View>
                    <Text style={styles.footerLabel}>View all members</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginTop: 24,
        gap: 12,
    },
    card: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
    },
    message: {
        color: '#6B7280',
        fontSize: 13,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 10,
    },
    rowDivider: {
        borderBottomWidth: 1,
        borderBottomColor: '#F2F5F7',
    },
    iconWrapper: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#F2F5F7',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textGroup: {
        flex: 1,
        gap: 2,
    },
    name: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000000',
    },
    timestamp: {
        fontSize: 12,
        color: '#6B7280',
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        paddingTop: 12,
        marginTop: 4,
        borderTopWidth: 1,
        borderTopColor: '#F2F5F7',
    },
    footerPressed: {
        opacity: 0.7,
    },
    footerLabel: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#000000',
    },
});
