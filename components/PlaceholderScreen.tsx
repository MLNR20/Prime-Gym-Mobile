import { Text, View } from 'react-native';
import { commonStyles } from './commonStyles';

export default function PlaceholderScreen({ title }: { title: string }) {
    return (
        <View style={commonStyles.container}>
            <Text className="text-xl font-poppins-bold">{title}</Text>
        </View>
    );
}
