import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { palette, themedStyles } from '../utils/theme';

type StatCardProps = {
    label: string;
    value: string;
    /** Optional line under the value, e.g. "12 payments". */
    hint?: string;
};

// Gray tile with a small label above a large value, used on the Finance and Reports screens.
export default function StatCard({ label, value, hint }: StatCardProps) {
    return (
        <View style={styles.card}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value}</Text>
            {!!hint && <Text style={styles.hint}>{hint}</Text>}
        </View>
    );
}

const styles = themedStyles(() => StyleSheet.create({
    card: {
        flex: 1,
        minWidth: 140,
        backgroundColor: palette.surface,
        borderWidth: 2,
        borderColor: palette.border,
        borderRadius: 12,
        padding: 16,
        gap: 4,
    },
    label: {
        color: palette.text,
        fontSize: 12,
        fontFamily: 'Poppins_400Regular',
    },
    value: {
        color: palette.text,
        fontSize: 22,
        fontFamily: 'Poppins_700Bold',
    },
    hint: {
        color: palette.muted,
        fontSize: 12,
        fontFamily: 'Poppins_400Regular',
    },
}));
