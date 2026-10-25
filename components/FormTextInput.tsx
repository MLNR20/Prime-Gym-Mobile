import { StyleSheet, View } from 'react-native';
import { Text, TextInput, type TextInputProps } from 'react-native-paper';

const GRAY = '#F2F5F7';

export function FormLabel({ children }: { children: string }) {
    return <Text style={styles.label}>{children}</Text>;
}

// Gray-filled input with its label above, shared by all the add/edit forms.
export default function FormTextInput({ label, style, ...props }: TextInputProps & { label: string }) {
    return (
        <View style={styles.field}>
            <FormLabel>{label}</FormLabel>
            <TextInput
                mode="outlined"
                outlineColor={GRAY}
                activeOutlineColor="#F59E0B"
                textColor="#111827"
                outlineStyle={styles.outline}
                style={[styles.input, style]}
                placeholder={label}
                placeholderTextColor="#9CA3AF"
                {...props}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    field: {
        width: '100%',
        gap: 6,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#3F2D00',
    },
    input: {
        width: '100%',
        backgroundColor: GRAY,
        fontSize: 16,
    },
    outline: {
        borderRadius: 8,
    },
});
