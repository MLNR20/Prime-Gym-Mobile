import type { ReactNode } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ActivityIndicator, List, Searchbar, Text } from 'react-native-paper';
import type { Program } from '../models/Program';
import { commonStyles } from './commonStyles';
import ProgramExerciseCountPill from './ProgramExerciseCountPill';

type ProgramListCardProps = {
    programs: Program[];
    exerciseCountFor: (program: Program) => number;
    query: string;
    onQueryChange: (query: string) => void;
    loading?: boolean;
    error?: string | null;
    emptyLabel?: string;
    renderRight?: (program: Program) => ReactNode;
    onItemPress?: (program: Program) => void;
    /** Set false when the search bar is rendered elsewhere (e.g. in a screen header) but should keep filtering this list. */
    showSearchBar?: boolean;
};

export default function ProgramListCard({
    programs = [],
    exerciseCountFor,
    query,
    onQueryChange,
    loading = false,
    error = null,
    emptyLabel = 'No programs found.',
    renderRight,
    onItemPress,
    showSearchBar = true,
}: ProgramListCardProps) {
    return (
        <View style={[commonStyles.listView, styles.flexFill]}>
            {showSearchBar && (
                <Searchbar placeholder="Search programs" onChangeText={onQueryChange} style={commonStyles.searchBar} placeholderTextColor="#9CA3AF" iconColor="#C4C7CC" value={query} />
            )}
            {loading && <ActivityIndicator style={styles.spinner} />}
            {!loading && error && (
                <Text style={styles.itemDescription} className="font-poppins text-base">{error}</Text>
            )}
            {!loading && !error && (
                <FlatList
                    style={styles.flexFill}
                    data={programs}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listItems}
                    renderItem={({ item }) => (
                        <List.Item
                            title={item.name}
                            description={() => (
                                <View style={styles.descriptionRow}>
                                    <ProgramExerciseCountPill count={exerciseCountFor(item)} />
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
