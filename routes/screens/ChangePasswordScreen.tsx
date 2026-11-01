import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import DetailsNavbar from '../../components/DetailsNavbar';
import FormActions from '../../components/FormActions';
import FormTextInput from '../../components/FormTextInput';
import { changePassword } from '../../viewmodels/useAuthViewModel';
import { palette, themedStyles } from '../../utils/theme';

type Errors = { current?: string; next?: string; confirm?: string; form?: string };

export default function ChangePasswordScreen({ onBack }: { onBack: () => void }) {
    const [current, setCurrent] = useState('');
    const [next, setNext] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showPasswords, setShowPasswords] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [saved, setSaved] = useState(false);
    const [errors, setErrors] = useState<Errors>({});

    const clearFeedback = () => {
        setErrors({});
        setSaved(false);
    };

    const handleSubmit = async () => {
        const nextErrors: Errors = {};
        if (!current) nextErrors.current = 'Enter your current password.';
        if (next.length < 6) nextErrors.next = 'Choose a password with at least 6 characters.';
        else if (next === current) nextErrors.next = 'Choose a password different from the current one.';
        if (confirm !== next) nextErrors.confirm = 'Passwords do not match.';
        setErrors(nextErrors);
        if (nextErrors.current || nextErrors.next || nextErrors.confirm) return;

        setSubmitting(true);
        try {
            await changePassword(current, next);
            setCurrent('');
            setNext('');
            setConfirm('');
            setSaved(true);
        } catch (err) {
            setErrors({ form: (err as Error).message });
        } finally {
            setSubmitting(false);
        }
    };

    const eyeToggle = (
        <TextInput.Icon
            icon={showPasswords ? 'eye-off-outline' : 'eye-outline'}
            color={palette.subtle}
            onPress={() => setShowPasswords((value) => !value)}
        />
    );

    return (
        <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <DetailsNavbar title="Change Password" onBack={onBack} bordered={false} />
            <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                <View style={styles.form}>
                    <FormTextInput
                        label="Current Password"
                        secureTextEntry={!showPasswords}
                        autoCapitalize="none"
                        autoComplete="current-password"
                        value={current}
                        onChangeText={(text) => {
                            setCurrent(text);
                            clearFeedback();
                        }}
                        errorMessage={errors.current}
                        right={eyeToggle}
                    />
                    <FormTextInput
                        label="New Password"
                        secureTextEntry={!showPasswords}
                        autoCapitalize="none"
                        autoComplete="new-password"
                        value={next}
                        onChangeText={(text) => {
                            setNext(text);
                            clearFeedback();
                        }}
                        errorMessage={errors.next}
                        right={eyeToggle}
                    />
                    <FormTextInput
                        label="Confirm New Password"
                        secureTextEntry={!showPasswords}
                        autoCapitalize="none"
                        autoComplete="new-password"
                        value={confirm}
                        onChangeText={(text) => {
                            setConfirm(text);
                            clearFeedback();
                        }}
                        onSubmitEditing={handleSubmit}
                        errorMessage={errors.confirm}
                        right={eyeToggle}
                    />

                    {!!errors.form && (
                        <View style={styles.messageBox}>
                            <Text style={styles.errorText}>{errors.form}</Text>
                        </View>
                    )}
                    {saved && (
                        <View style={styles.messageBox}>
                            <Text style={styles.successText}>Your password has been changed.</Text>
                        </View>
                    )}

                    <FormActions submitLabel="Update Password" onSubmit={handleSubmit} onCancel={onBack} cancelLabel={saved ? 'Done' : 'Cancel'} loading={submitting} />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = themedStyles(() => StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: palette.background,
    },
    content: {
        paddingHorizontal: 32,
        paddingVertical: 24,
    },
    form: {
        width: '100%',
        gap: 20,
    },
    messageBox: {
        paddingHorizontal: 4,
    },
    errorText: {
        color: palette.dangerText,
        fontSize: 12,
        fontFamily: 'Poppins_500Medium',
    },
    successText: {
        color: palette.ok,
        fontSize: 12,
        fontFamily: 'Poppins_500Medium',
    },
}));
