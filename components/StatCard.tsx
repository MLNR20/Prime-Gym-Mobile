import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

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

const styles = StyleSheet.create({
    card: {
        flex: 1,
        minWidth: 140,
        backgroundColor: '#F2F5F7',
        borderWidth: 2,
        borderColor: '#EDF0F2',
        borderRadius: 12,
        padding: 16,
        gap: 4,
    },
    label: {
        color: '#000000',
        fontSize: 12,
        fontFamily: 'Poppins_400Regular',
    },
    value: {
        color: '#000000',
        fontSize: 22,
        fontFamily: 'Poppins_700Bold',
    },
    hint: {
        color: '#6B7280',
        fontSize: 12,
        fontFamily: 'Poppins_400Regular',
    },
});
