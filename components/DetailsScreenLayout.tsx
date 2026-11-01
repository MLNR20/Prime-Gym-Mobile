import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import DetailsNavbar from './DetailsNavbar';
import { detailsTypography } from './detailsTypography';
import { palette, themedStyles } from '../utils/theme';

type DetailsScreenLayoutProps = {
    onBack: () => void;
    onEdit: () => void;
    /** Small hint under the sections, e.g. "Manage your contacts right here". */
    footerText: string;
    /** One or more DetailSection cards. */
    children: ReactNode;
};

// Shared frame for every details screen: navbar (pencil icon edits), scrollable sections, then the footer hint.
// Delete lives in the DetailsHeader (trash icon) inside the first card.
export default function DetailsScreenLayout({ onBack, onEdit, footerText, children }: DetailsScreenLayoutProps) {
    return (
        <View style={styles.screen}>
            <DetailsNavbar onBack={onBack} rightIcon="pencil-outline" onRightPress={onEdit} bordered={false} />
            <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
                {children}
                <Text style={styles.footerText}>{footerText}</Text>
            </ScrollView>
        </View>
    );
}

const styles = themedStyles(() => StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: palette.background,
    },
    scroll: {
        flex: 1,
    },
    content: {
        paddingHorizontal: 32,
        paddingTop: 16,
        paddingBottom: 32,
        gap: 12,
    },
    footerText: {
        width: '100%',
        marginTop: 24,
        textAlign: 'center',
        color: palette.subtle,
        ...detailsTypography.footer,
    },
}));
