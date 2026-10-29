import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';

type DetailsHeaderProps = {
    title: string;
    subtitle?: string;
    onDelete: () => void;
    deleteLabel: string;
    /** Status pill shown under the name. */
    children?: ReactNode;
};

// Name, optional subtitle and status pill, with the trash icon beside the name. Rendered inside the first
// DetailSection card on every details screen.
export default function DetailsHeader({ title, subtitle, onDelete, deleteLabel, children }: DetailsHeaderProps) {
    return (
        <View style={styles.header}>
            <View style={styles.nameRow}>
                <Text style={styles.title}>{title}</Text>
                <IconButton icon="trash-can-outline" iconColor="#DC2626" size={22} onPress={onDelete} style={styles.iconAction} accessibilityLabel={deleteLabel} />
            </View>
            {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        width: '100%',
        gap: 8,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    title: {
        flex: 1,
        color: '#000000',
        fontSize: 21.6, // 1.35rem
        fontFamily: 'Poppins_700Bold',
    },
    subtitle: {
        color: '#5a3f00',
        fontFamily: 'Poppins_400Regular',
    },
    iconAction: {
        margin: 0,
    },
});
