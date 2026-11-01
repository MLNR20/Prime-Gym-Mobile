import { StyleSheet } from 'react-native';
import { palette, themedStyles } from '../utils/theme';

/** Border shared by every gray-filled surface (cards, search bars, icon tiles). */
// A getter, so the color follows the current scheme whenever a style sheet spreads it.
export const surfaceBorder = {
    borderWidth: 2,
    get borderColor() {
        return palette.border;
    },
};

export const commonStyles = themedStyles(() => StyleSheet.create({
    /** Title text on every list card (subscriber, contact, equipment, ...). */
    cardTitle: {
        color: palette.text,
        fontFamily: 'Poppins_800ExtraBold',
    },
    container: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        backgroundColor: palette.background,
        paddingTop: 64,
        paddingHorizontal: 32,
        gap: 4,
    },
    scrollView: {
        backgroundColor: palette.background,
        paddingHorizontal: 32,
        paddingVertical: 64,
    },
    inputField: {
        width: '100%',
        height: 48,
        borderWidth: 1,
        borderColor: palette.divider,
        borderRadius: 8,
        paddingHorizontal: 12,
        fontSize: 16,
        color: palette.text,
    },
    listView: {
        backgroundColor: palette.background,
        width: '100%',
        gap: 12,
    },
    cardForListView:
    {
        backgroundColor: palette.surface,
        ...surfaceBorder,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    submitButton:
    {
        width: '100%',
        backgroundColor: '#F59E0B',
        borderRadius: 8,
        textAlign: 'center',
        color: '#fff',
    },
    submitButtonContent:
    {
        height: 40 + 0.4 * 16,
    },
    // Save/Cancel on the add/edit views: submitButtonContent + 0.1rem.
    formActionButtonContent:
    {
        height: 40 + 0.5 * 16,
    },
    searchBar:
    {
        width: '100%',
        borderRadius: 8,
        backgroundColor: palette.surface,
        ...surfaceBorder,
    }
}));

export const dashboardScreenStyles = themedStyles(() => StyleSheet.create({
    scrollView: {
        backgroundColor: palette.background,
        paddingHorizontal: 32,
        paddingVertical: 32,
    },
    content: {
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        backgroundColor: palette.background,
        paddingTop: 64,
        gap: 4,
    },
}));

export const quickActionsGridStyles = themedStyles(() => StyleSheet.create({
    container: {
        width: '100%',
        marginTop: 24,
        gap: 12,
    },
    card: {
        width: '100%',
        gap: 16,
        backgroundColor: palette.background,
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 0,
    },
    row: {
        flexDirection: 'row',
        width: '100%',
    },
    cell: {
        width: '25%',
        flexGrow: 0,
        flexShrink: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pressable: {
        width: '100%',
    },
    item: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    iconContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    labelContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconWrapper: {
        alignSelf: 'center',
        borderRadius: 12,
        backgroundColor: palette.surface,
        ...surfaceBorder,
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        textAlign: 'center',
        textAlignVertical: 'center',
        includeFontPadding: false,
    },
    label: {
        width: '100%',
        fontSize: 12 + 0.1 * 16,
        textAlign: 'center',
    },
}));
