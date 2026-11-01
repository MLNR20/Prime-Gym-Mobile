import { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import BreakdownRow from '../../components/BreakdownRow';
import DetailsNavbar from '../../components/DetailsNavbar';
import StatCard from '../../components/StatCard';
import { formatPeso } from '../../utils/currency';
import { summarizeSubscribers } from '../../utils/finance';
import { MEMBER_STATUS_LABELS, type MemberStatus } from '../../utils/memberStatus';
import { useSubscribersViewModel } from '../../viewmodels/useSubscribersViewModel';
import { palette, themedStyles } from '../../utils/theme';

type ReportsScreenProps = {
    onBack: () => void;
};

// A function so the colors follow the current scheme instead of being fixed when the module loads.
const getStatuses = (): { status: MemberStatus; color: string }[] => [
    { status: 'active', color: palette.ok },
    { status: 'expired', color: palette.warnText },
    { status: 'inactive', color: palette.dangerText },
];

export default function ReportsScreen({ onBack }: ReportsScreenProps) {
    const { members, loading, error } = useSubscribersViewModel();
    const breakdown = useMemo(() => summarizeSubscribers(members), [members]);
    const planTotal = breakdown.byPlan.reduce((sum, row) => sum + row.count, 0);

    return (
        <View style={styles.screen}>
            <DetailsNavbar title="Reports" onBack={onBack} />
            {loading && <ActivityIndicator style={styles.spinner} />}
            {!loading && error && <Text style={styles.message}>{error}</Text>}
            {!loading && !error && (
                <ScrollView contentContainerStyle={styles.content}>
                    <View style={styles.statRow}>
                        <StatCard label="Total Subscribers" value={String(breakdown.total)} />
                        <StatCard label="Expiring in 7 Days" value={String(breakdown.expiringSoon)} />
                    </View>

                    <Text style={styles.sectionTitle}>By Status</Text>
                    <View style={styles.table}>
                        {getStatuses().map(({ status, color }) => (
                            <BreakdownRow
                                key={status}
                                label={MEMBER_STATUS_LABELS[status]}
                                value={String(breakdown.byStatus[status])}
                                fraction={breakdown.total > 0 ? breakdown.byStatus[status] / breakdown.total : 0}
                                color={color}
                            />
                        ))}
                    </View>

                    <Text style={styles.sectionTitle}>By Plan</Text>
                    <View style={styles.table}>
                        {breakdown.byPlan.map((row) => (
                            <BreakdownRow
                                key={row.plan}
                                label={row.plan}
                                value={`${row.count} · ${formatPeso(row.earned)}`}
                                fraction={planTotal > 0 ? row.count / planTotal : 0}
                            />
                        ))}
                    </View>
                </ScrollView>
            )}
        </View>
    );
}

const styles = themedStyles(() => StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: palette.background,
    },
    content: {
        paddingHorizontal: 32,
        paddingTop: 24,
        paddingBottom: 32,
        gap: 12,
    },
    statRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    sectionTitle: {
        marginTop: 12,
        color: palette.text,
        fontSize: 16,
        fontFamily: 'Poppins_700Bold',
    },
    table: {
        backgroundColor: palette.surface,
        borderWidth: 2,
        borderColor: palette.border,
        borderRadius: 12,
        paddingHorizontal: 16,
    },
    message: {
        color: palette.brown,
        fontFamily: 'Poppins_400Regular',
    },
    spinner: {
        paddingVertical: 12,
    },
}));
