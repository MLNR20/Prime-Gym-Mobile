import { StyleSheet, Text, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import { palette, themedStyles } from '../utils/theme';

type LabelHeaderProps = {
    label: string;
    icon?: string;
    onPress: () => void;
};

export default function LabelHeader({ label, icon = 'bell-outline', onPress }: LabelHeaderProps) {
    return (
        <View style={styles.row}>
            <Text className="text-[1.45rem] font-poppins-bold" style={{ color: palette.text }}>{label}</Text>
            <IconButton icon={icon} mode="outlined" iconColor={palette.text} onPress={onPress} style={styles.iconButton} />
        </View>
    );
}

const styles = themedStyles(() => StyleSheet.create({
    iconButton: {
        margin: 0,
        borderWidth: 2,
        borderColor: palette.border,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
}));
