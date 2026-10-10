import { StyleSheet, Text, View } from 'react-native';
import { IconButton } from 'react-native-paper';

type LabelHeaderNavProps = {
    label: string;
    icon?: string;
    onNavigate: () => void;
    onBellPress?: () => void;
};

export default function LabelHeaderNav({ label, icon = 'plus', onNavigate, onBellPress = () => {} }: LabelHeaderNavProps) {
    return (
        <View style={styles.row}>
            <Text className="text-[1.45rem] font-poppins-bold mt-[-0.18rem]">{label}</Text>
            <View style={styles.actions}>
                <IconButton icon="bell-outline" size={23.2} onPress={onBellPress} iconColor="#F59E0B" containerColor="#fff" />
                <IconButton icon={icon} size={23.2} onPress={onNavigate} iconColor="#F59E0B" containerColor="#fff" />
            </View>
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
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});
