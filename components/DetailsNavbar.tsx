import { StyleSheet, View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';

type DetailsNavbarProps = {
    onBack: () => void;
    onBellPress?: () => void;
};

export default function DetailsNavbar({ onBack, onBellPress = () => {} }: DetailsNavbarProps) {
    return (
        <View style={styles.navbar}>
            <View style={styles.row}>
                <IconButton icon="arrow-left" iconColor="#000000" onPress={onBack} style={styles.iconButton} />
                <Text style={styles.title} className="text-[1.45rem] font-poppins-bold">
                    Details
                </Text>
                <IconButton icon="bell-outline" iconColor="#000000" onPress={onBellPress} style={styles.iconButton} />
            </View>
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
    title: {
        flex: 1,
        color: '#000000',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
