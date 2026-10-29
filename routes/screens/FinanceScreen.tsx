import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, List, Text } from 'react-native-paper';
import AddMemberScreen from './AddMemberScreen';
import BreakdownRow from '../../components/BreakdownRow';
import DetailsNavbar from '../../components/DetailsNavbar';
import type { MemberFormValues } from '../../components/MemberForm';
import StatCard from '../../components/StatCard';
import { commonStyles } from '../../components/commonStyles';
import { formatPeso } from '../../utils/currency';
import { formatDateOnly } from '../../utils/dateTime';
import { summarizeFinance } from '../../utils/finance';
import { useSubscribersViewModel } from '../../viewmodels/useSubscribersViewModel';

type FinanceScreenProps = {
    onBack: () => void;
};

export default function FinanceScreen({ onBack }: FinanceScreenProps) {
    const { members, loading, error, submitMember } = useSubscribersViewModel();
    const [isAdding, setIsAdding] = useState(false);
    const summary = useMemo(() => summarizeFinance(members), [members]);

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
            <DetailsNavbar title="Finance" onBack={onBack} rightIcon="plus" onRightPress={() => setIsAdding(true)} />
            {loading && <ActivityIndicator style={styles.spinner} />}
            {!loading && error && <Text style={styles.message}>{error}</Text>}
            {!loading && !error && (
                <ScrollView contentContainerStyle={styles.content}>
                    <View style={styles.statRow}>
                        <StatCard label="Total Earned" value={formatPeso(summary.totalEarned)} hint={`${summary.paymentCount} subscription payments`} />
                        <StatCard label="This Month" value={formatPeso(summary.earnedThisMonth)} />
                    </View>

                    <Text style={styles.sectionTitle}>Earnings by Plan</Text>
                    <View style={styles.table}>
                        {summary.byPlan.map((row) => (
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
                        {summary.payments.length === 0 && <Text style={styles.message}>No subscription payments yet.</Text>}
                        {summary.payments.map((member) => (
                            <List.Item
                                key={member.id}
                                title={`${member.first_name} ${member.last_name}`}
                                description={`${member.plan} · ${formatDateOnly(member.payment_date)}`}
                                titleStyle={styles.itemTitle}
                                descriptionStyle={styles.itemDescription}
                                style={commonStyles.cardForListView}
                                right={() => <Text style={styles.amount}>{formatPeso(member.payment_amount ?? 0)}</Text>}
                            />
                        ))}
                    </View>
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#fff',
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
        color: '#000000',
        fontSize: 16,
        fontFamily: 'Poppins_700Bold',
    },
    table: {
        backgroundColor: '#F2F5F7',
        borderWidth: 2,
        borderColor: '#EDF0F2',
        borderRadius: 12,
        paddingHorizontal: 16,
    },
    list: {
        gap: 12,
    },
    itemTitle: {
        color: '#000000',
        fontFamily: 'Poppins_600SemiBold',
    },
    itemDescription: {
        color: '#6B7280',
        fontFamily: 'Poppins_400Regular',
    },
    amount: {
        alignSelf: 'center',
        color: '#000000',
        fontFamily: 'Poppins_600SemiBold',
    },
    message: {
        color: '#5C4300',
        fontFamily: 'Poppins_400Regular',
    },
    spinner: {
        paddingVertical: 12,
    },
});
