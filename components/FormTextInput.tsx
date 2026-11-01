import { StyleSheet, View } from 'react-native';
import { Text, TextInput, type TextInputProps } from 'react-native-paper';
import { palette, themedStyles } from '../utils/theme';


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
                outlineColor={errorMessage ? palette.danger : palette.surface}
                activeOutlineColor={errorMessage ? palette.danger : '#F59E0B'}
                textColor={palette.inputText}
                outlineStyle={styles.outline}
                style={[styles.input, style]}
                placeholder={label}
                placeholderTextColor={palette.subtle}
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

const styles = themedStyles(() => StyleSheet.create({
    field: {
        width: '100%',
        gap: 6,
    },
    label: {
        fontSize: 15.76, // 0.875rem + 0.01rem + 0.1rem
        fontFamily: 'Poppins_700Bold',
        color: palette.text,
    },
    input: {
        width: '100%',
        backgroundColor: palette.surface,
        fontSize: 16,
    },
    outline: {
        borderRadius: 8,
    },
    errorBox: {
        paddingHorizontal: 4,
    },
    errorText: {
        color: palette.dangerText,
        fontSize: 12,
        fontFamily: 'Poppins_500Medium',
    },
}));
