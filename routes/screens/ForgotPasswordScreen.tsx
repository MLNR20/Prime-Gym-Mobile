import { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import FormTextInput from '../../components/FormTextInput';
import { commonStyles } from '../../components/commonStyles';
import { rem } from '../../utils/rem';
import { sendPasswordReset } from '../../viewmodels/useAuthViewModel';
import { palette, themedStyles } from '../../utils/theme';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ForgotPasswordScreenProps = {
    onShowLogin: () => void;
};

export default function ForgotPasswordScreen({ onShowLogin }: ForgotPasswordScreenProps) {
    const [email, setEmail] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [sent, setSent] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; form?: string }>({});

    const handleSubmit = async () => {
        if (!EMAIL_PATTERN.test(email.trim())) {
            setErrors({ email: 'Enter a valid email address.' });
            return;
        }
        setErrors({});
        setSubmitting(true);
        try {
            await sendPasswordReset(email);
            setSent(true);
        } catch (err) {
            setErrors({ form: (err as Error).message });
        }
        setSubmitting(false);
    };

    return (
        <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                <View style={styles.brand}>
                    <Image source={require('../../assets/prime-gym-logo.png')} style={styles.logo} resizeMode="cover" />
                    <Text style={styles.title}>Forgot your password?</Text>
                    <Text style={styles.subtitle}>Enter your email and we'll send you a link to reset it.</Text>
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
                            setSent(false);
                            setErrors({});
                        }}
                        onSubmitEditing={handleSubmit}
                        errorMessage={errors.email}
                    />

                    {!!errors.form && (
                        <View style={styles.message}>
                            <Text style={styles.errorText}>{errors.form}</Text>
                        </View>
                    )}
                    {sent && (
                        <View style={styles.message}>
                            <Text style={styles.successText}>
                                If an account exists for that email, a reset link is on its way. Check your inbox and spam folder.
                            </Text>
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
                            {sent ? 'Send Again' : 'Send Reset Link'}
                        </Button>

                        <View style={styles.switchRow}>
                            <Text style={styles.switchText}>Remembered it?</Text>
                            <Button mode="text" compact textColor="#F59E0B" labelStyle={styles.switchLabel} onPress={onShowLogin}>
                                Back to log in
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
        fontSize: rem(1.45),
        fontFamily: 'Poppins_700Bold',
        textAlign: 'center',
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
    message: {
        paddingHorizontal: 4,
    },
    errorText: {
        color: palette.dangerText,
        fontSize: 12,
        fontFamily: 'Poppins_500Medium',
    },
    successText: {
        color: palette.ok,
        fontSize: 13,
        fontFamily: 'Poppins_500Medium',
    },
    // Log In-style block: the button and the link row below it, 12px apart, 8px below the field.
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
