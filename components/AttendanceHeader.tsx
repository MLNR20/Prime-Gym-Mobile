import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

type AttendanceHeaderProps = {
    onAddPress?: () => void;
};

export default function AttendanceHeader({ onAddPress }: AttendanceHeaderProps) {
    return (
        <View style={styles.row}>
            <Text className="text-xl font-poppins-bold">Attendance</Text>
            {onAddPress && (
                <Button mode="contained" onPress={onAddPress}>
                    Add
                </Button>
            )}
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
