import { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import FormTextInput from '../../components/FormTextInput';
import { commonStyles } from '../../components/commonStyles';
import { rem } from '../../utils/rem';
import { signInWithEmail, signInWithGoogle } from '../../viewmodels/useAuthViewModel';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen() {
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

    const handleGoogle = async () => {
        setErrors({});
        setSubmitting(true);
        try {
            // Same as email login: on success the auth listener in App swaps this screen out.
            await signInWithGoogle();
        } catch (err) {
            setErrors({ form: (err as Error).message });
        }
        setSubmitting(false);
    };

    return (
        <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                <View style={styles.brand}>
                    <Image source={require('../../assets/icon.png')} style={styles.logo} />
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
                                color="#9CA3AF"
                                onPress={() => setShowPassword((current) => !current)}
                            />
                        }
                    />

                    {!!errors.form && (
                        <View style={styles.errorBox}>
                            <Text style={styles.errorText}>{errors.form}</Text>
                        </View>
                    )}

                    <Button
                        mode="contained"
                        textColor="#fff"
                        contentStyle={commonStyles.submitButtonContent}
                        labelStyle={styles.buttonLabel}
                        onPress={handleSubmit}
                        loading={submitting}
                        disabled={submitting}
                        style={commonStyles.submitButton}
                    >
                        Log In
                    </Button>
                </View>

                <View style={styles.footer}>
                    <View style={styles.dividerRow}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>or</Text>
                        <View style={styles.dividerLine} />
                    </View>
                    <Button
                        mode="outlined"
                        icon="google"
                        textColor="#000000"
                        contentStyle={commonStyles.submitButtonContent}
                        labelStyle={styles.buttonLabel}
                        onPress={handleGoogle}
                        disabled={submitting}
                        style={styles.googleButton}
                    >
                        Continue with Google
                    </Button>
                    <Text style={styles.footerNote}>New here? Continuing with Google creates your account.</Text>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#fff',
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
    logo: {
        width: 80,
        height: 80,
        borderRadius: 20,
        marginBottom: 8,
    },
    title: {
        color: '#000000',
        fontSize: rem(1.45),
        fontFamily: 'Poppins_700Bold',
    },
    subtitle: {
        color: '#6B7280',
        fontSize: rem(0.95),
        fontFamily: 'Poppins_400Regular',
    },
    form: {
        width: '100%',
        gap: 20,
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
    footer: {
        width: '100%',
        gap: 16,
    },
    dividerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E5E7EB',
    },
    dividerText: {
        color: '#9CA3AF',
        fontSize: 14,
        fontFamily: 'Poppins_500Medium',
    },
    googleButton: {
        width: '100%',
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#EDF0F2',
        backgroundColor: '#F2F5F7',
    },
    footerNote: {
        color: '#6B7280',
        fontSize: 12,
        fontFamily: 'Poppins_400Regular',
        textAlign: 'center',
    },
    // Paper's default button label is 14px; +0.2rem (3.2px), same as the add/edit forms.
    buttonLabel: {
        fontSize: 17.2,
        lineHeight: 24,
    },
});
