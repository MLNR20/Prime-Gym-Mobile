import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import { palette, themedStyles } from '../utils/theme';

type DetailsNavbarProps = {
    title?: string;
    // Omit on top-level screens (e.g. a tab) that have nowhere to go back to.
    onBack?: () => void;
    // Omit when the navbar has no action button; a spacer keeps the title centered.
    rightIcon?: string;
    onRightPress?: () => void;
    // Draws the thin line under the navbar; turned off on details and add/edit screens.
    bordered?: boolean;
    // Rendered inside the navbar, below the title row (e.g. a search bar).
    children?: ReactNode;
};

export default function DetailsNavbar({
    title = 'Details',
    onBack,
    rightIcon,
    onRightPress,
    bordered = true,
    children,
}: DetailsNavbarProps) {
    return (
        <View style={[styles.navbar, !bordered && styles.navbarBorderless]}>
            <View style={styles.row}>
                <View style={styles.side}>
                    {onBack ? (
                        <IconButton icon="arrow-left" iconColor={palette.text} onPress={onBack} style={styles.iconButton} />
                    ) : (
                        <View style={styles.spacer} />
                    )}
                </View>
                <Text style={styles.title} className="text-[1.45rem] font-poppins-bold">
                    {title}
                </Text>
                <View style={[styles.side, styles.sideEnd]}>
                    {rightIcon ? (
                        <IconButton icon={rightIcon} iconColor={palette.text} onPress={onRightPress} style={styles.iconButton} />
                    ) : (
                        <View style={styles.spacer} />
                    )}
                </View>
            </View>
            {children}
        </View>
    );
}

const styles = themedStyles(() => StyleSheet.create({
    navbar: {
        backgroundColor: palette.background,
        paddingHorizontal: 32,
        paddingTop: 80, // 48 + 2rem
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: palette.divider,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: -12,
    },
    navbarBorderless: {
        borderBottomWidth: 0,
    },
    iconButton: {
        margin: 0,
    },
    side: {
        flexDirection: 'row',
        alignItems: 'center',
        minWidth: 40,
    },
    sideEnd: {
        justifyContent: 'flex-end',
    },
    spacer: {
        width: 40,
    },
    title: {
        flex: 1,
        color: palette.text,
        fontFamily: 'Poppins_700Bold',
        textAlign: 'center',
    },
}));
