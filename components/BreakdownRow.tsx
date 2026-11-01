import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { palette, themedStyles } from '../utils/theme';

type BreakdownRowProps = {
    label: string;
    /** Right-aligned text, e.g. "12 · ₱18,000.00". */
    value: string;
    /** 0–1 share of the whole, drawn as a bar under the label. */
    fraction: number;
    color?: string;
};

export default function BreakdownRow({ label, value, fraction, color = '#F59E0B' }: BreakdownRowProps) {
    const percent = Math.max(0, Math.min(1, fraction)) * 100;
    return (
        <View style={styles.row}>
            <View style={styles.textRow}>
                <Text style={styles.label}>{label}</Text>
                <Text style={styles.value}>{value}</Text>
            </View>
            <View style={styles.track}>
                <View style={[styles.fill, { width: `${percent}%`, backgroundColor: color }]} />
            </View>
        </View>
    );
}

const styles = themedStyles(() => StyleSheet.create({
    row: {
        gap: 8,
        paddingVertical: 12,
    },
    textRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12,
    },
    label: {
        color: palette.text,
        fontSize: 14,
        fontFamily: 'Poppins_500Medium',
    },
    value: {
        color: palette.text,
        fontSize: 14,
        fontFamily: 'Poppins_400Regular',
    },
    track: {
        height: 8,
        borderRadius: 4,
        backgroundColor: palette.divider,
        overflow: 'hidden',
    },
    fill: {
        height: 8,
        borderRadius: 4,
    },
}));
