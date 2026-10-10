import type { ReactNode } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ActivityIndicator, List, Searchbar, Text } from 'react-native-paper';
import type { Equipment } from '../models/Equipment';
import { commonStyles } from './commonStyles';
import EquipmentStatusPill from './EquipmentStatusPill';

type EquipmentListCardProps = {
    equipment: Equipment[];
    query: string;
    onQueryChange: (query: string) => void;
    loading?: boolean;
    error?: string | null;
    emptyLabel?: string;
    renderRight?: (equipment: Equipment) => ReactNode;
    onItemPress?: (equipment: Equipment) => void;
    /** Set false when the search bar is rendered elsewhere (e.g. in a screen header) but should keep filtering this list. */
    showSearchBar?: boolean;
};

export default function EquipmentListCard({
    equipment = [],
    query,
    onQueryChange,
    loading = false,
    error = null,
    emptyLabel = 'No equipment found.',
    renderRight,
    onItemPress,
    showSearchBar = true,
}: EquipmentListCardProps) {
    return (
        <View style={[commonStyles.listView, styles.flexFill]}>
            {showSearchBar && (
                <Searchbar placeholder="Search equipment" onChangeText={onQueryChange} style={commonStyles.searchBar} placeholderTextColor="#9CA3AF" value={query} />
            )}
            {loading && <ActivityIndicator style={styles.spinner} />}
            {!loading && error && (
                <Text style={styles.itemDescription} className="font-poppins text-base">{error}</Text>
            )}
            {!loading && !error && (
                <FlatList
                    style={styles.flexFill}
                    data={equipment}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listItems}
                    renderItem={({ item }) => (
                        <List.Item
                            title={item.title}
                            description={() => (
                                <View style={styles.descriptionRow}>
                                    <EquipmentStatusPill equipment={item} />
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
    itemTitle: {
        color: '#3F2D00',
        fontWeight: 'bold',
    },
    itemDescription: {
        color: '#5C4300',
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
