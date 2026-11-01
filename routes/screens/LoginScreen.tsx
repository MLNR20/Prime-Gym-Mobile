import { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import FormTextInput from '../../components/FormTextInput';
import { commonStyles } from '../../components/commonStyles';
import { rem } from '../../utils/rem';
import { signInWithEmail } from '../../viewmodels/useAuthViewModel';
import { palette, themedStyles } from '../../utils/theme';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type LoginScreenProps = {
    onShowSignUp: () => void;
    onShowForgotPassword: () => void;
};

export default function LoginScreen({ onShowSignUp, onShowForgotPassword }: LoginScreenProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});

    const handleSubmit = async () => {
        const nextErrors: typeof errors = {};
        if (!EMAIL_PATTERN.test(email.trim())) nextErrors.email = 'Enter a valid email address.';
        if (!password) nextErrors.password = 'Enter your password.';
        setErrors(nextErrors);
        if (nextErrors.email || nextErrors.password) return;

        setSubmitting(true);
        try {
            // On success the auth listener in App swaps this screen out, so there is nothing to navigate to here.
            await signInWithEmail(email, password);
        } catch (err) {
            setErrors({ form: (err as Error).message });
            setSubmitting(false);
        }
    };

    return (
        <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                <View style={styles.brand}>
                    <Image source={require('../../assets/prime-gym-logo.png')} style={styles.logo} resizeMode="cover" />
                    <Text style={styles.title}>Prime Gym</Text>
                    <Text style={styles.subtitle}>Sign in to manage your gym</Text>
                </View>

                <View style={styles.form}>
                    <FormTextInput
                        label="Email"
                        placeholder="owner@primegym.ph"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoComplete="email"
                        autoCorrect={false}
                        value={email}
                        onChangeText={(text) => {
                            setEmail(text);
                            setErrors((current) => ({ ...current, email: undefined, form: undefined }));
                        }}
                        errorMessage={errors.email}
                    />
                    <FormTextInput
                        label="Password"
                        placeholder="Password"
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                        autoComplete="current-password"
                        value={password}
                        onChangeText={(text) => {
                            setPassword(text);
                            setErrors((current) => ({ ...current, password: undefined, form: undefined }));
                        }}
                        onSubmitEditing={handleSubmit}
                        errorMessage={errors.password}
                        right={
                            <TextInput.Icon
                                icon={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                color={palette.subtle}
                                onPress={() => setShowPassword((current) => !current)}
                            />
                        }
                    />

                    <View style={styles.forgotRow}>
                        <Button mode="text" compact textColor="#F59E0B" labelStyle={styles.switchLabel} onPress={onShowForgotPassword}>
                            Forgot password?
                        </Button>
                    </View>

                    {!!errors.form && (
                        <View style={styles.errorBox}>
                            <Text style={styles.errorText}>{errors.form}</Text>
                        </View>
                    )}

                    <View style={styles.actions}>
                        <Button
                            mode="contained"
                            textColor="#fff"
                            contentStyle={commonStyles.submitButtonContent}
                            onPress={handleSubmit}
                            loading={submitting}
                            disabled={submitting}
                            style={commonStyles.submitButton}
                        >
                            Log In
                        </Button>

                        <View style={styles.switchRow}>
                            <Text style={styles.switchText}>New here?</Text>
                            <Button mode="text" compact textColor="#F59E0B" labelStyle={styles.switchLabel} onPress={onShowSignUp}>
                                Create an account
                            </Button>
                        </View>
                    </View>
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
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 32,
        paddingVertical: 64,
        gap: 40,
    },
    brand: {
        alignItems: 'center',
        gap: 8,
    },
    // The PNG is 1200x412, so the box is the same shape and the image fills it with no empty margin.
    logo: {
        width: 240,
        height: 82,
        borderRadius: 8,
        marginBottom: 8,
    },
    title: {
        color: palette.text,
        fontSize: rem(1.35),
        fontFamily: 'Poppins_700Bold',
    },
    subtitle: {
        color: palette.muted,
        fontSize: rem(0.85),
        fontFamily: 'Poppins_400Regular',
    },
    form: {
        width: '100%',
        gap: 20,
    },
    errorBox: {
        paddingHorizontal: 4,
    },
    errorText: {
        color: palette.dangerText,
        fontSize: 12,
        fontFamily: 'Poppins_500Medium',
    },
    forgotRow: {
        alignItems: 'flex-end',
        marginTop: -12,
    },
    // Log In button and the "New here?" row: 12px apart, 8px below the fields.
    actions: {
        gap: 12,
        marginTop: 8,
    },
    switchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    switchText: {
        color: palette.muted,
        fontSize: rem(0.875),
        fontFamily: 'Poppins_400Regular',
    },
    switchLabel: {
        fontSize: rem(0.875),
        fontFamily: 'Poppins_600SemiBold',
    },
}));
