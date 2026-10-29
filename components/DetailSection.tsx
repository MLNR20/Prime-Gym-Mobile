import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { Divider, Text } from 'react-native-paper';

export type DetailRowData = {
    label: string;
    value: string;
    /** Spans both columns, for long text such as notes or a list of names. */
    fullWidth?: boolean;
};

type DetailSectionProps = {
    title: string;
    description: string;
    rows: DetailRowData[];
    /** Rendered at the top of the card, above the title (e.g. a DetailsHeader). */
    header?: ReactNode;
};

function DetailRow({ label, value, fullWidth }: DetailRowData) {
    return (
        <View style={[styles.row, fullWidth && styles.rowFull]}>
            <Text style={styles.rowLabel}>{label}</Text>
            <Text style={styles.rowValue}>{value}</Text>
        </View>
    );
}

// An hr followed by a bordered card: bold title, short description, then the fields in two columns.
// Shared by every details screen.
export default function DetailSection({ title, description, rows, header }: DetailSectionProps) {
    return (
        <View>
            <Divider style={styles.divider} />
            <View style={styles.card}>
                {header}
                {!!header && <Divider style={styles.headerDivider} />}
                <View style={styles.cardHeader}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.description}>{description}</Text>
                </View>
                {rows.map((row) => (
                    <DetailRow key={row.label} {...row} />
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    divider: {
        backgroundColor: '#EDF0F2',
    },
    headerDivider: {
        width: '100%',
        backgroundColor: '#EDF0F2',
    },
    card: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        rowGap: 16,
        marginTop: 16,
        borderWidth: 2,
        borderColor: '#EDF0F2',
        borderRadius: 12,
        padding: 16,
    },
    cardHeader: {
        width: '100%',
        gap: 2,
    },
    title: {
        color: '#000000',
        fontSize: 16,
        fontFamily: 'Poppins_700Bold',
    },
    description: {
        color: '#6B7280',
        fontSize: 13.6,
        fontFamily: 'Poppins_400Regular',
    },
    row: {
        width: '50%',
        gap: 8,
        paddingRight: 8,
    },
    rowFull: {
        width: '100%',
    },
    rowLabel: {
        color: '#6B7280',
        fontSize: 12,
        fontFamily: 'Poppins_600SemiBold',
    },
    rowValue: {
        color: '#000000',
        fontSize: 16,
    },
});
