import { StyleSheet, Text, View } from 'react-native';
import { IconButton } from 'react-native-paper';

type LabelHeaderNavProps = {
    label: string;
    icon?: string;
    onNavigate: () => void;
};

export default function LabelHeaderNav({ label, icon = 'plus', onNavigate }: LabelHeaderNavProps) {
    return (
        <View style={styles.row}>
            <Text className="text-xl font-poppins-bold mt-[0.02rem]">{label}</Text>
            <IconButton icon={icon} onPress={onNavigate} />
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
