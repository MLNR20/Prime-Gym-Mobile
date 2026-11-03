import { StyleSheet } from 'react-native';
import { List, Text } from 'react-native-paper';
import type { Member } from '../models/Member';
import { commonStyles } from './commonStyles';
import { formatPeso } from '../utils/currency';
import { formatDateOnly } from '../utils/dateTime';
import { palette, themedStyles } from '../utils/theme';

// One subscription payment: subscriber name, plan and date on the left, amount on the right.
export default function PaymentListItem({ member }: { member: Member }) {
    return (
        <List.Item
            title={`${member.first_name} ${member.last_name}`}
            description={`${member.plan} · ${formatDateOnly(member.payment_date)}`}
            titleStyle={styles.title}
            descriptionStyle={styles.description}
            style={commonStyles.cardForListView}
            right={() => <Text style={styles.amount}>{formatPeso(member.payment_amount ?? 0)}</Text>}
        />
    );
}

const styles = themedStyles(() => StyleSheet.create({
    title: {
        color: palette.text,
        fontFamily: 'Poppins_600SemiBold',
    },
    description: {
        color: palette.muted,
        fontFamily: 'Poppins_400Regular',
    },
    amount: {
        alignSelf: 'center',
        color: palette.text,
        fontFamily: 'Poppins_600SemiBold',
    },
}));
