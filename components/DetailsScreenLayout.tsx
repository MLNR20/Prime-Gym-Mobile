import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import DetailsNavbar from './DetailsNavbar';
import { commonStyles } from './commonStyles';

type DetailsScreenLayoutProps = {
    onBack: () => void;
    onEdit: () => void;
    /** Small hint under the Edit button, e.g. "Manage your contacts right here". */
    footerText: string;
    /** One or more DetailSection cards. */
    children: ReactNode;
};

// Shared frame for every details screen: navbar, scrollable sections, then the full-width Edit button.
// Delete lives in the DetailsHeader (trash icon) inside the first card.
export default function DetailsScreenLayout({ onBack, onEdit, footerText, children }: DetailsScreenLayoutProps) {
    return (
        <View style={styles.screen}>
            <DetailsNavbar onBack={onBack} bordered={false} />
            <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
                {children}
                <Button
                    mode="contained"
                    buttonColor="#7C3AED"
                    textColor="#fff"
                    contentStyle={commonStyles.submitButtonContent}
                    style={styles.editButton}
                    onPress={onEdit}
                >
                    Edit
                </Button>
                <Text style={styles.footerText}>{footerText}</Text>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#fff',
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
    editButton: {
        width: '100%',
        borderRadius: 8,
        marginTop: 12,
    },
    footerText: {
        width: '100%',
        marginTop: 24,
        textAlign: 'center',
        color: '#9CA3AF',
        fontSize: 12,
    },
});
