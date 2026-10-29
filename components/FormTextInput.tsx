import { StyleSheet, View } from 'react-native';
import { Text, TextInput, type TextInputProps } from 'react-native-paper';

const GRAY = '#F2F5F7';
const ERROR_RED = '#DC2626';

export function FormLabel({ children }: { children: string }) {
    return <Text style={styles.label}>{children}</Text>;
}

// Gray-filled input with its label above, shared by all the add/edit forms.
// When `errorMessage` is set, the input is outlined in red and the message appears in a box below it.
export default function FormTextInput({
    label,
    style,
    errorMessage,
    ...props
}: TextInputProps & { label: string; errorMessage?: string }) {
    return (
        <View style={styles.field}>
            <FormLabel>{label}</FormLabel>
            <TextInput
                mode="outlined"
                outlineColor={errorMessage ? ERROR_RED : GRAY}
                activeOutlineColor={errorMessage ? ERROR_RED : '#F59E0B'}
                textColor="#111827"
                outlineStyle={styles.outline}
                style={[styles.input, style]}
                placeholder={label}
                placeholderTextColor="#9CA3AF"
                error={!!errorMessage}
                {...props}
            />
            {!!errorMessage && (
                <View style={styles.errorBox}>
                    <Text style={styles.errorText}>{errorMessage}</Text>
                </View>
            )}
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
        fontFamily: 'Poppins_700Bold',
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
    errorBox: {
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#FECACA',
        backgroundColor: '#FEE2E2',
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    errorText: {
        color: '#B91C1C',
        fontSize: 12,
        fontFamily: 'Poppins_500Medium',
    },
});
