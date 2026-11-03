import { StyleSheet } from 'react-native';
import { Searchbar } from 'react-native-paper';
import DetailsNavbar from './DetailsNavbar';
import { commonStyles } from './commonStyles';
import { palette, themedStyles } from '../utils/theme';

type SearchNavbarProps = {
    title: string;
    onBack?: () => void;
    // Omit for a search-only navbar with no action button on the right.
    onAddPress?: () => void;
    // Icon of the action button on the right; the + button by default.
    rightIcon?: string;
    searchPlaceholder: string;
    query: string;
    onQueryChange: (query: string) => void;
};

// Details-style navbar (back, centered title, + button) with the search bar inside it.
export default function SearchNavbar({
    title,
    onBack,
    onAddPress,
    rightIcon = 'plus',
    searchPlaceholder,
    query,
    onQueryChange,
}: SearchNavbarProps) {
    return (
        <DetailsNavbar
            title={title}
            onBack={onBack}
            rightIcon={onAddPress ? rightIcon : undefined}
            onRightPress={onAddPress}
        >
            <Searchbar
                placeholder={searchPlaceholder}
                onChangeText={onQueryChange}
                style={[commonStyles.searchBar, styles.searchBar]}
                inputStyle={styles.searchInput}
                placeholderTextColor={palette.subtle}
                iconColor={palette.iconMuted}
                value={query}
            />
        </DetailsNavbar>
    );
}

const styles = themedStyles(() => StyleSheet.create({
    searchBar: {
        marginTop: 16,
        borderWidth: 2,
        borderColor: palette.border,
    },
    searchInput: {
        color: palette.bodyText,
    },
}));
