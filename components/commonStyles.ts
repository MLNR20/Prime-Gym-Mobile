import { StyleSheet } from 'react-native';

export const commonStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        backgroundColor: '#fff',
        paddingTop: 64,
        paddingHorizontal: 32,
        gap: 4,
    },
    scrollView: {
        backgroundColor: '#fff',
        paddingHorizontal: 32,
        paddingVertical: 64,
    },
    inputField: {
        width: '100%',
        height: 48,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        paddingHorizontal: 12,
        fontSize: 16,
        color: '#000',
    },
    listView: {
        backgroundColor: '#fff',
        width: '100%',
        gap: 12,
    },
    cardForListView:
    {
        backgroundColor: '#F2F5F7',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 4,
    },
    submitButton:
    {
        width: 100,
        backgroundColor: '#F59E0B',
        borderRadius: 8,
        textAlign: 'center',
        color: '#fff',
    },
    searchBar:
    {
        width: '100%',
        borderRadius: 8,
        backgroundColor: '#F2F5F7'
    }
});

export const dashboardScreenStyles = StyleSheet.create({
    scrollView: {
        backgroundColor: '#fff',
        paddingHorizontal: 32,
        paddingVertical: 32,
    },
    content: {
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        backgroundColor: '#fff',
        paddingTop: 64,
        gap: 4,
    },
});

export const quickActionsGridStyles = StyleSheet.create({
    container: {
        width: '100%',
        marginTop: 24,
        gap: 12,
    },
    card: {
        width: '100%',
        gap: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 4,
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
    itemPressed: {
        opacity: 0.7,
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
        backgroundColor: '#F2F5F7',
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
});
