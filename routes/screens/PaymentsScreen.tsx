import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import PaymentListItem from '../../components/PaymentListItem';
import SearchNavbar from '../../components/SearchNavbar';
import type { Member } from '../../models/Member';
import { filterPayments, NO_PAYMENT_FILTERS } from '../../utils/finance';
import { palette, themedStyles } from '../../utils/theme';

type PaymentsScreenProps = {
    /** Subscription payments to search, newest first. */
    payments: Member[];
    onBack: () => void;
};

// Every subscription payment with a search bar; there is nothing to add here, so the navbar has no + button.
export default function PaymentsScreen({ payments, onBack }: PaymentsScreenProps) {
    const [query, setQuery] = useState('');
    const results = useMemo(() => filterPayments(payments, { ...NO_PAYMENT_FILTERS, query }), [payments, query]);

    return (
        <View style={styles.screen}>
            <SearchNavbar
                title="Payments"
                onBack={onBack}
                searchPlaceholder="Search payments"
                query={query}
                onQueryChange={setQuery}
            />
            <ScrollView contentContainerStyle={styles.content}>
                {results.length === 0 && (
                    <Text style={styles.message}>{query.trim() ? 'No payments match your search.' : 'No subscription payments yet.'}</Text>
                )}
                {results.map((member) => (
                    <PaymentListItem key={member.id} member={member} />
                ))}
            </ScrollView>
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
    message: {
        color: palette.brown,
        fontFamily: 'Poppins_400Regular',
    },
}));
