import { StyleSheet } from 'react-native';
import { Searchbar } from 'react-native-paper';
import DetailsNavbar from './DetailsNavbar';
import { commonStyles } from './commonStyles';

type SearchNavbarProps = {
    title: string;
    onBack?: () => void;
    onAddPress: () => void;
    // When provided, a circled bell appears to the left of the + button.
    onBellPress?: () => void;
    searchPlaceholder: string;
    query: string;
    onQueryChange: (query: string) => void;
};

// Details-style navbar (back, centered title, + button) with the search bar inside it.
export default function SearchNavbar({
    title,
    onBack,
    onAddPress,
    onBellPress,
    searchPlaceholder,
    query,
    onQueryChange,
}: SearchNavbarProps) {
    return (
        <DetailsNavbar
            title={title}
            onBack={onBack}
            rightIcon="plus"
            onRightPress={onAddPress}
            showBell={!!onBellPress}
            onBellPress={onBellPress}
        >
            <Searchbar
                placeholder={searchPlaceholder}
                onChangeText={onQueryChange}
                style={[commonStyles.searchBar, styles.searchBar]}
                inputStyle={styles.searchInput}
                placeholderTextColor="#9CA3AF"
                iconColor="#C4C7CC"
                value={query}
            />
        </DetailsNavbar>
    );
}

const styles = StyleSheet.create({
    searchBar: {
        marginTop: 16,
        borderWidth: 2,
        borderColor: '#EDF0F2',
    },
    searchInput: {
        color: '#374151',
    },
});
