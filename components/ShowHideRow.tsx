import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

export default function ShowHideRow({ text }: { text: string }) {
    const [visible, setVisible] = useState(true);

    return (
        <View style={styles.row}>
            <Text className="font-poppins text-base">{visible ? text : ''}</Text>
            <Button mode="text" onPress={() => setVisible((prev) => !prev)}>
                {visible ? 'Hide' : 'Show'}
            </Button>
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
