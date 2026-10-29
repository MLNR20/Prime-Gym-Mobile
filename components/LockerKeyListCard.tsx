import type { ReactNode } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ActivityIndicator, List, Searchbar, Text } from 'react-native-paper';
import type { LockerKey } from '../models/LockerKey';
import { commonStyles } from './commonStyles';
import LockerKeyStatusPill from './LockerKeyStatusPill';

type LockerKeyListCardProps = {
    lockerKeys: LockerKey[];
    query: string;
    onQueryChange: (query: string) => void;
    loading?: boolean;
    error?: string | null;
    emptyLabel?: string;
    renderRight?: (lockerKey: LockerKey) => ReactNode;
    onItemPress?: (lockerKey: LockerKey) => void;
    /** Set false when the search bar is rendered elsewhere (e.g. in a screen header) but should keep filtering this list. */
    showSearchBar?: boolean;
};

export default function LockerKeyListCard({
    lockerKeys = [],
    query,
    onQueryChange,
    loading = false,
    error = null,
    emptyLabel = 'No locker keys found.',
    renderRight,
    onItemPress,
    showSearchBar = true,
}: LockerKeyListCardProps) {
    return (
        <View style={[commonStyles.listView, styles.flexFill]}>
            {showSearchBar && (
                <Searchbar placeholder="Search locker keys" onChangeText={onQueryChange} style={commonStyles.searchBar} placeholderTextColor="#9CA3AF" iconColor="#C4C7CC" value={query} />
            )}
            {loading && <ActivityIndicator style={styles.spinner} />}
            {!loading && error && (
                <Text style={styles.itemDescription} className="font-poppins text-base">{error}</Text>
            )}
            {!loading && !error && (
                <FlatList
                    style={styles.flexFill}
                    data={lockerKeys}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listItems}
                    renderItem={({ item }) => (
                        <List.Item
                            title={`Locker ${item.locker_number}`}
                            description={() => (
                                <View style={styles.descriptionRow}>
                                    <Text style={styles.keyCode}>{item.key_code}</Text>
                                    <LockerKeyStatusPill lockerKey={item} />
                                </View>
                            )}
                            titleStyle={styles.itemTitle}
                            style={commonStyles.cardForListView}
                            onPress={onItemPress ? () => onItemPress(item) : undefined}
                            right={renderRight ? () => renderRight(item) : undefined}
                        />
                    )}
                    ListEmptyComponent={
                        <Text style={styles.itemDescription} className="font-poppins text-base">{emptyLabel}</Text>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    flexFill: {
        flex: 1,
    },
    listItems: {
        gap: 12,
    },
    itemTitle: commonStyles.cardTitle,
    itemDescription: {
        color: '#5C4300',
    },
    keyCode: {
        color: '#5a3f00',
        fontSize: 12,
    },
    descriptionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 8,
    },
    spinner: {
        paddingVertical: 12,
    },
});
