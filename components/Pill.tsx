import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

type PillVariant = 'success' | 'warning' | 'danger';

type PillProps = {
    label: string;
    variant: PillVariant;
};

const VARIANT_COLORS: Record<PillVariant, { background: string; text: string }> = {
    success: { background: '#DCFCE7', text: '#15803D' },
    warning: { background: '#FEF3C7', text: '#B45309' },
    danger: { background: '#FEE2E2', text: '#B91C1C' },
};

export default function Pill({ label, variant }: PillProps) {
    const colors = VARIANT_COLORS[variant];
    return (
        <View style={[styles.pill, { backgroundColor: colors.background }]}>
            <Text style={{ color: colors.text, fontFamily: 'Poppins_500Medium' }} className="font-poppins-medium text-[0.775rem]">
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
});
