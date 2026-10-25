import type { ReactNode } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ActivityIndicator, List, Text } from 'react-native-paper';
import type { AttendanceRecord } from '../models/AttendanceRecord';
import { formatPhilippineTimestamp } from '../utils/dateTime';
import { commonStyles } from './commonStyles';

export type AttendanceRow = AttendanceRecord & {
    memberName: string;
    lockerLabel: string;
};

type AttendanceListCardProps = {
    rows: AttendanceRow[];
    loading?: boolean;
    error?: string | null;
    emptyLabel?: string;
    renderRight?: (row: AttendanceRow) => ReactNode;
    onItemPress?: (row: AttendanceRow) => void;
};

export default function AttendanceListCard({
    rows = [],
    loading = false,
    error = null,
    emptyLabel = 'No attendance records found.',
    renderRight,
    onItemPress,
}: AttendanceListCardProps) {
    return (
        <View style={[commonStyles.listView, styles.flexFill]}>
            {loading && <ActivityIndicator style={styles.spinner} />}
            {!loading && error && <Text style={styles.message}>{error}</Text>}
            {!loading && !error && (
                <FlatList
                    style={styles.flexFill}
                    data={rows}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listItems}
                    renderItem={({ item }) => (
                        <List.Item
                            title={item.memberName}
                            description={() => (
                                <View style={styles.details}>
                                    <Text style={styles.detailText}>{item.lockerLabel}</Text>
                                    <Text style={styles.detailText}>In: {formatPhilippineTimestamp(item.time_in)}</Text>
                                    <Text style={styles.detailText}>
                                        Out: {item.time_out ? formatPhilippineTimestamp(item.time_out) : '—'}
                                    </Text>
                                </View>
                            )}
                            titleStyle={styles.itemTitle}
                            style={commonStyles.cardForListView}
                            onPress={onItemPress ? () => onItemPress(item) : undefined}
                            right={renderRight ? () => renderRight(item) : undefined}
                        />
                    )}
                    ListEmptyComponent={<Text style={styles.message}>{emptyLabel}</Text>}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    flexFill: {
        flex: 1,
    },
    listItems: {
        gap: 12,
    },
    itemTitle: {
        color: '#3F2D00',
        fontWeight: 'bold',
    },
    details: {
        marginTop: 6,
        gap: 2,
    },
    detailText: {
        color: '#5a3f00',
        fontSize: 12,
    },
    message: {
        color: '#5C4300',
    },
    spinner: {
        paddingVertical: 12,
    },
});
