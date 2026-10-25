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
    // Rendered inside the navbar, below the title row (e.g. a search bar).
    children?: ReactNode;
};

export default function DetailsNavbar({
    title = 'Details',
    onBack,
    rightIcon = 'bell-outline',
    onRightPress,
    onBellPress = () => {},
    children,
}: DetailsNavbarProps) {
    return (
        <View style={styles.navbar}>
            <View style={styles.row}>
                {onBack ? (
                    <IconButton icon="arrow-left" iconColor="#000000" onPress={onBack} style={styles.iconButton} />
                ) : (
                    <View style={styles.backSpacer} />
                )}
                <Text style={styles.title} className="text-[1.45rem] font-poppins-bold">
                    {title}
                </Text>
                <IconButton
                    icon={rightIcon}
                    iconColor="#000000"
                    onPress={onRightPress ?? onBellPress}
                    style={styles.iconButton}
                />
            </View>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    navbar: {
        backgroundColor: '#fff',
        paddingHorizontal: 32,
        paddingTop: 48,
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
    iconButton: {
        margin: 0,
    },
    backSpacer: {
        width: 40,
    },
    title: {
        flex: 1,
        color: '#000000',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
