import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { palette } from '../utils/theme';

type PillVariant = 'success' | 'warning' | 'danger';

type PillProps = {
    label: string;
    variant: PillVariant;
};

// A function so the colors follow the current scheme instead of being fixed when the module loads.
const variantColors = (variant: PillVariant): { background: string; text: string } =>
    ({
        success: { background: palette.okBg, text: palette.ok },
        warning: { background: palette.warnBg, text: palette.warnText },
        danger: { background: palette.dangerBg, text: palette.dangerText },
    })[variant];

export default function Pill({ label, variant }: PillProps) {
    const colors = variantColors(variant);
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
