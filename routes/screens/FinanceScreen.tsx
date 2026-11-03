import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import AddMemberScreen from './AddMemberScreen';
import PaymentsScreen from './PaymentsScreen';
import BreakdownRow from '../../components/BreakdownRow';
import FilterChips from '../../components/FilterChips';
import type { MemberFormValues } from '../../components/MemberForm';
import PaymentListItem from '../../components/PaymentListItem';
import SearchNavbar from '../../components/SearchNavbar';
import StatCard from '../../components/StatCard';
import { formatPeso } from '../../utils/currency';
import {
    filterPayments,
    hasPaymentFilters,
    NO_PAYMENT_FILTERS,
    PAYMENT_PERIODS,
    summarizeFinance,
    type PaymentFilters,
} from '../../utils/finance';
import { useSubscribersViewModel } from '../../viewmodels/useSubscribersViewModel';
import { palette, themedStyles } from '../../utils/theme';

// Payments listed before "View all" is pressed.
const PREVIEW_COUNT = 5;

type FinanceScreenProps = {
    onBack: () => void;
};

export default function FinanceScreen({ onBack }: FinanceScreenProps) {
    const { members, loading, error, submitMember } = useSubscribersViewModel();
    const [isAdding, setIsAdding] = useState(false);
    const [viewingAll, setViewingAll] = useState(false);
    const [filters, setFilters] = useState<PaymentFilters>(NO_PAYMENT_FILTERS);
    const filtersActive = hasPaymentFilters(filters);
    const summary = useMemo(() => summarizeFinance(filterPayments(members, filters)), [members, filters]);
    // Plan chips come from every subscriber, not the filtered ones, so they don't vanish as filters narrow the list.
    const planOptions = useMemo(
        () => [{ value: '', label: 'All plans' }, ...summarizeFinance(members).byPlan.map(({ plan }) => ({ value: plan, label: plan }))],
        [members]
    );
    const setFilter = <K extends keyof PaymentFilters>(key: K, value: PaymentFilters[K]) =>
        setFilters((current) => ({ ...current, [key]: value }));

    if (viewingAll) return <PaymentsScreen payments={summary.payments} onBack={() => setViewingAll(false)} />;

    if (isAdding) {
        return (
            <AddMemberScreen
                editingMember={null}
                onSubmit={async (values: MemberFormValues) => {
                    await submitMember(values);
                    setIsAdding(false);
                }}
                onCancel={() => setIsAdding(false)}
            />
        );
    }

    return (
        <View style={styles.screen}>
            <SearchNavbar
                title="Finance"
                onBack={onBack}
                onAddPress={() => setIsAdding(true)}
                searchPlaceholder="Search payments"
                query={filters.query}
                onQueryChange={(query) => setFilter('query', query)}
            />
            {loading && <ActivityIndicator style={styles.spinner} />}
            {!loading && error && <Text style={styles.message}>{error}</Text>}
            {!loading && !error && (
                <ScrollView contentContainerStyle={styles.content}>
                    <FilterChips label="Period" value={filters.period} options={PAYMENT_PERIODS} onChange={(period) => setFilter('period', period)} />
                    <FilterChips label="Plan" value={filters.plan} options={planOptions} onChange={(plan) => setFilter('plan', plan)} />
                    {filtersActive && (
                        <Pressable onPress={() => setFilters(NO_PAYMENT_FILTERS)}>
                            <Text style={styles.clear}>Clear filters</Text>
                        </Pressable>
                    )}

                    <View style={styles.statRow}>
                        <StatCard
                            label={filtersActive ? 'Filtered Total' : 'Total Earned'}
                            value={formatPeso(summary.totalEarned)}
                            hint={`${summary.paymentCount} subscription payments`}
                        />
                        <StatCard label="This Month" value={formatPeso(summary.earnedThisMonth)} />
                    </View>

                    <Text style={styles.sectionTitle}>Earnings by Plan</Text>
                    <View style={styles.table}>
                        {summary.byPlan.filter((row) => !filters.plan || row.plan === filters.plan).map((row) => (
                            <BreakdownRow
                                key={row.plan}
                                label={row.plan}
                                value={`${formatPeso(row.earned)} · ${row.count}`}
                                fraction={summary.totalEarned > 0 ? row.earned / summary.totalEarned : 0}
                            />
                        ))}
                    </View>

                    <Text style={styles.sectionTitle}>Subscription Payments</Text>
                    <View style={styles.list}>
                        {summary.payments.length === 0 && (
                            <Text style={styles.message}>{filtersActive ? 'No payments match your filters.' : 'No subscription payments yet.'}</Text>
                        )}
                        {summary.payments.slice(0, PREVIEW_COUNT).map((member) => (
                            <PaymentListItem key={member.id} member={member} />
                        ))}
                        {summary.payments.length > PREVIEW_COUNT && (
                            <Pressable onPress={() => setViewingAll(true)}>
                                <Text style={styles.viewAll}>{`View all (${summary.payments.length})`}</Text>
                            </Pressable>
                        )}
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
    viewAll: {
        alignSelf: 'center',
        paddingVertical: 8,
        color: '#F59E0B',
        fontFamily: 'Poppins_600SemiBold',
    },
    clear: {
        alignSelf: 'flex-start',
        color: '#F59E0B',
        fontFamily: 'Poppins_600SemiBold',
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
    list: {
        gap: 12,
    },
    message: {
        color: palette.brown,
        fontFamily: 'Poppins_400Regular',
    },
    spinner: {
        paddingVertical: 12,
    },
}));
