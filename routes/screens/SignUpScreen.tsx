import { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import FormTextInput from '../../components/FormTextInput';
import { commonStyles } from '../../components/commonStyles';
import { rem } from '../../utils/rem';
import { signUpWithEmail } from '../../viewmodels/useAuthViewModel';
import { palette, themedStyles } from '../../utils/theme';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

type SignUpScreenProps = {
    onShowLogin: () => void;
};

type Errors = { name?: string; email?: string; password?: string; confirm?: string; form?: string };

export default function SignUpScreen({ onShowLogin }: SignUpScreenProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<Errors>({});

    const clear = (field: keyof Errors) => setErrors((current) => ({ ...current, [field]: undefined, form: undefined }));

    const handleSubmit = async () => {
        const next: Errors = {};
        if (!name.trim()) next.name = 'Enter your name.';
        if (!EMAIL_PATTERN.test(email.trim())) next.email = 'Enter a valid email address.';
        if (password.length < MIN_PASSWORD_LENGTH) next.password = `Use at least ${MIN_PASSWORD_LENGTH} characters.`;
        if (confirm !== password) next.confirm = 'Passwords do not match.';
        setErrors(next);
        if (Object.keys(next).length > 0) return;

        setSubmitting(true);
        try {
            // On success the auth listener in App swaps this screen out, so there is nothing to navigate to here.
            await signUpWithEmail(name, email, password);
        } catch (err) {
            setErrors({ form: (err as Error).message });
            setSubmitting(false);
        }
    };

    const eyeIcon = (
        <TextInput.Icon
            icon={showPassword ? 'eye-off-outline' : 'eye-outline'}
            color={palette.subtle}
            onPress={() => setShowPassword((current) => !current)}
        />
    );

    return (
        <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                <View style={styles.brand}>
                    <Image source={require('../../assets/prime-gym-logo.png')} style={styles.logo} resizeMode="cover" />
                    <Text style={styles.title}>Create your account</Text>
                    <Text style={styles.subtitle}>Sign up to start managing your gym</Text>
                </View>

                <View style={styles.form}>
                    <FormTextInput
                        label="Full Name"
                        placeholder="Juan Dela Cruz"
                        autoComplete="name"
                        value={name}
                        onChangeText={(text) => {
                            setName(text);
                            clear('name');
                        }}
                        errorMessage={errors.name}
                    />
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
                            clear('email');
                        }}
                        errorMessage={errors.email}
                    />
                    <FormTextInput
                        label="Password"
                        placeholder="At least 6 characters"
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                        autoComplete="new-password"
                        value={password}
                        onChangeText={(text) => {
                            setPassword(text);
                            clear('password');
                        }}
                        errorMessage={errors.password}
                        right={eyeIcon}
                    />
                    <FormTextInput
                        label="Confirm Password"
                        placeholder="Re-enter your password"
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                        autoComplete="new-password"
                        value={confirm}
                        onChangeText={(text) => {
                            setConfirm(text);
                            clear('confirm');
                        }}
                        onSubmitEditing={handleSubmit}
                        errorMessage={errors.confirm}
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
                        onPress={handleSubmit}
                        loading={submitting}
                        disabled={submitting}
                        style={commonStyles.submitButton}
                    >
                        Sign Up
                    </Button>
                </View>

                <View style={styles.switchRow}>
                    <Text style={styles.switchText}>Already have an account?</Text>
                    <Button mode="text" compact textColor="#F59E0B" labelStyle={styles.switchLabel} onPress={onShowLogin}>
                        Log in
                    </Button>
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
        gap: 32,
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
        fontSize: rem(1.45),
        fontFamily: 'Poppins_700Bold',
    },
    subtitle: {
        color: palette.muted,
        fontSize: rem(0.95),
        fontFamily: 'Poppins_400Regular',
        textAlign: 'center',
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
