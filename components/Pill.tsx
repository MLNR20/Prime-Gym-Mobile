import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

type PillVariant = 'success' | 'danger';

type PillProps = {
    label: string;
    variant: PillVariant;
};

export default function Pill({ label, variant }: PillProps) {
    return (
        <View style={[styles.pill, variant === 'success' ? styles.success : styles.danger]}>
            <Text
                style={variant === 'success' ? styles.successText : styles.dangerText}
                className="font-poppins-medium text-xs"
            >
                {label}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    pill: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 999,
    },
    success: {
        backgroundColor: '#DCFCE7',
    },
    successText: {
        color: '#15803D',
    },
    danger: {
        backgroundColor: '#FEE2E2',
    },
    dangerText: {
        color: '#B91C1C',
    },
});
