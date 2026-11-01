import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import { detailsTypography } from './detailsTypography';
import { palette, themedStyles } from '../utils/theme';

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
                <IconButton icon="trash-can-outline" iconColor={palette.danger} size={22} onPress={onDelete} style={styles.iconAction} accessibilityLabel={deleteLabel} />
            </View>
            {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            {children}
        </View>
    );
}

const styles = themedStyles(() => StyleSheet.create({
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
        color: palette.text,
        ...detailsTypography.title,
    },
    subtitle: {
        color: palette.brown,
        ...detailsTypography.subtitle,
    },
    iconAction: {
        margin: 0,
    },
}));
