import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';

type DetailsNavbarProps = {
    title?: string;
    // Omit on top-level screens (e.g. a tab) that have nowhere to go back to.
    onBack?: () => void;
    rightIcon?: string;
    onRightPress?: () => void;
    // Kept for existing callers that only wire up the bell.
    onBellPress?: () => void;
    // Shows a circled bell to the left of the right icon.
    showBell?: boolean;
    // Draws the thin line under the navbar; turned off on details and add/edit screens.
    bordered?: boolean;
    // Rendered inside the navbar, below the title row (e.g. a search bar).
    children?: ReactNode;
};

export default function DetailsNavbar({
    title = 'Details',
    onBack,
    rightIcon = 'bell-outline',
    onRightPress,
    onBellPress = () => {},
    showBell = false,
    bordered = true,
    children,
}: DetailsNavbarProps) {
    // Matching side widths keep the title centered when the right side holds two buttons.
    const sideStyle = showBell ? styles.sideWide : undefined;
    return (
        <View style={[styles.navbar, !bordered && styles.navbarBorderless]}>
            <View style={styles.row}>
                <View style={[styles.side, sideStyle]}>
                    {onBack ? (
                        <IconButton icon="arrow-left" iconColor="#000000" onPress={onBack} style={styles.iconButton} />
                    ) : (
                        <View style={styles.backSpacer} />
                    )}
                </View>
                <Text style={styles.title} className="text-[1.45rem] font-poppins-bold">
                    {title}
                </Text>
                <View style={[styles.side, styles.sideEnd, sideStyle]}>
                    {showBell && (
                        <IconButton
                            icon="bell-outline"
                            mode="outlined"
                            size={24}
                            iconColor="#000000"
                            onPress={onBellPress}
                            style={[styles.iconButton, styles.bellButton]}
                        />
                    )}
                    <IconButton
                        icon={rightIcon}
                        mode={showBell ? 'outlined' : undefined}
                        iconColor="#000000"
                        onPress={onRightPress ?? onBellPress}
                        style={[styles.iconButton, showBell && styles.bellButton]}
                    />
                </View>
            </View>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    navbar: {
        backgroundColor: '#fff',
        paddingHorizontal: 32,
        paddingTop: 80, // 48 + 2rem
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
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
    sideWide: {
        width: 88,
    },
    sideEnd: {
        justifyContent: 'flex-end',
        gap: 8,
    },
    bellButton: {
        borderWidth: 2,
        borderColor: '#EDF0F2',
    },
    backSpacer: {
        width: 40,
    },
    title: {
        flex: 1,
        color: '#000000',
        fontWeight: 'bold',
        fontFamily: 'Poppins_700Bold',
        textAlign: 'center',
    },
});
