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
            <Text className="text-xl font-poppins-bold">{label}</Text>
            <IconButton icon={icon} onPress={onPress} />
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
});
