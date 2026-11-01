import { StyleSheet, View } from 'react-native';
import { Divider, Text } from 'react-native-paper';
import { formatDateOnly } from '../utils/dateTime';
import { palette, themedStyles } from '../utils/theme';

type PaymentDateDividerProps = {
    paymentDate: string;
};

export default function PaymentDateDivider({ paymentDate }: PaymentDateDividerProps) {
    return (
        <View style={styles.container}>
            <Divider style={styles.line} />
            <Text style={styles.label}>
                Paid {formatDateOnly(paymentDate)}
            </Text>
            <Divider style={styles.line} />
        </View>
    );
}

const styles = themedStyles(() => StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        gap: 12,
    },
    line: {
        flex: 1,
        backgroundColor: palette.divider,
    },
    label: {
        color: palette.muted,
        fontSize: 12,
        fontFamily: 'Poppins_700Bold',
        textAlign: 'center',
    },
}));
