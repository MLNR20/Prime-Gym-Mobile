import { StyleSheet, Text, View } from 'react-native';
import { IconButton } from 'react-native-paper';

type LabelHeaderProps = {
    label: string;
    icon?: string;
    onPress: () => void;
};

export default function LabelHeader({ label, icon = 'bell-outline', onPress }: LabelHeaderProps) {
    return (
        <View style={styles.row}>
            <Text className="text-[1.45rem] font-poppins-bold">{label}</Text>
            <IconButton icon={icon} mode="outlined" iconColor="#000000" onPress={onPress} style={styles.iconButton} />
        </View>
    );
}

const styles = StyleSheet.create({
    iconButton: {
        margin: 0,
        borderWidth: 2,
        borderColor: '#EDF0F2',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
});
