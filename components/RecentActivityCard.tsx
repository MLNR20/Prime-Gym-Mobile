import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRecentActivityViewModel } from '../viewmodels/useRecentActivityViewModel';
import { surfaceBorder } from './commonStyles';
import { formatPhilippineTimestamp } from '../utils/dateTime';

export default function RecentActivityCard() {
    const { entries, loading, error } = useRecentActivityViewModel();

    return (
        <View style={styles.container}>
            <Text className="text-lg font-poppins-bold text-black">Recent Activity</Text>
            <View style={styles.card}>
                {loading && <Text style={styles.message}>Loading...</Text>}
                {!loading && error && <Text style={styles.message}>{error}</Text>}
                {!loading && !error && entries.length === 0 && (
                    <Text style={styles.message}>No recent activity.</Text>
                )}
                {!loading &&
                    !error &&
                    entries.map((entry, index) => (
                        <View
                            key={entry.id}
                            style={[styles.row, index < entries.length - 1 && styles.rowDivider]}
                        >
                            <View style={styles.iconWrapper}>
                                <Ionicons name="checkmark-done-outline" size={30} color="#FBBF77" />
                            </View>
                            <View style={styles.textGroup}>
                                <Text style={styles.name} numberOfLines={1}>
                                    {entry.action}
                                </Text>
                                <Text style={styles.timestamp} numberOfLines={1}>
                                    {entry.reference} · {formatPhilippineTimestamp(entry.date_created)}
                                </Text>
                            </View>
                        </View>
                    ))}
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
        paddingHorizontal: 0,
        paddingVertical: 6,
    },
    message: {
        color: '#6B7280',
        fontSize: 13,
        fontFamily: 'Poppins_400Regular',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
        paddingVertical: 12,
    },
    rowDivider: {
        borderBottomWidth: 1,
        borderBottomColor: '#F2F5F7',
    },
    iconWrapper: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#F2F5F7',
        ...surfaceBorder,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textGroup: {
        flex: 1,
        gap: 2,
    },
    name: {
        fontSize: 14 + 0.1 * 16,
        color: '#000000',
        fontFamily: 'Poppins_700Bold',
    },
    timestamp: {
        fontSize: 15.2,
        color: '#6B7280',
        fontFamily: 'Poppins_400Regular',
    },
});
