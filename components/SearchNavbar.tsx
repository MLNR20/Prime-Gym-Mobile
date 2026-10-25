import { StyleSheet } from 'react-native';
import { Searchbar } from 'react-native-paper';
import DetailsNavbar from './DetailsNavbar';
import { commonStyles } from './commonStyles';

type SearchNavbarProps = {
    title: string;
    onBack?: () => void;
    onAddPress: () => void;
    searchPlaceholder: string;
    query: string;
    onQueryChange: (query: string) => void;
};

// Details-style navbar (back, centered title, + button) with the search bar inside it.
export default function SearchNavbar({
    title,
    onBack,
    onAddPress,
    searchPlaceholder,
    query,
    onQueryChange,
}: SearchNavbarProps) {
    return (
        <DetailsNavbar title={title} onBack={onBack} rightIcon="plus" onRightPress={onAddPress}>
            <Searchbar
                placeholder={searchPlaceholder}
                onChangeText={onQueryChange}
                style={[commonStyles.searchBar, styles.searchBar]}
                inputStyle={styles.searchInput}
                placeholderTextColor="#9CA3AF"
                value={query}
            />
        </DetailsNavbar>
    );
}

const styles = StyleSheet.create({
    searchBar: {
        marginTop: 16,
    },
    searchInput: {
        color: '#374151',
    },
});
