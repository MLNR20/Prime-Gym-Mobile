import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import DetailsNavbar from '../../components/DetailsNavbar';
import FormActions from '../../components/FormActions';
import FormTextInput from '../../components/FormTextInput';
import { logAudit } from '../../utils/auditLog';
import { loadGymProfile, saveGymProfile } from '../../utils/gymProfile';
import { palette, themedStyles } from '../../utils/theme';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Settings > Gym Profile: the gym's name and contact details, shown on the Profile screen.
export default function GymProfileScreen({ onBack }: { onBack: () => void }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [ready, setReady] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<{ name?: string; email?: string; form?: string }>({});

    useEffect(() => {
        loadGymProfile().then((profile) => {
            setName(profile.name);
            setEmail(profile.email);
            setPhone(profile.phone);
            setAddress(profile.address);
            setReady(true);
        });
    }, []);

    const handleSubmit = async () => {
        const trimmedName = name.trim();
        const trimmedEmail = email.trim();
        const nextErrors: typeof errors = {};
        if (!trimmedName) nextErrors.name = 'Enter the gym name.';
        if (trimmedEmail && !EMAIL_PATTERN.test(trimmedEmail)) nextErrors.email = 'Enter a valid email address.';
        setErrors(nextErrors);
        if (nextErrors.name || nextErrors.email) return;

        setSubmitting(true);
        try {
            await saveGymProfile({ name: trimmedName, email: trimmedEmail, phone: phone.trim(), address: address.trim() });
            await logAudit(trimmedName, 'Updated gym profile');
            onBack();
        } catch {
            setErrors({ form: 'Could not save the gym profile. Please try again.' });
            setSubmitting(false);
        }
    };

    return (
        <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <DetailsNavbar title="Gym Profile" onBack={onBack} bordered={false} />
            <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                <View style={styles.form}>
                    <FormTextInput
                        label="Gym Name"
                        value={name}
                        editable={ready}
                        onChangeText={(text) => {
                            setName(text);
                            setErrors({});
                        }}
                        errorMessage={errors.name}
                    />
                    <FormTextInput
                        label="Email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        value={email}
                        editable={ready}
                        onChangeText={(text) => {
                            setEmail(text);
                            setErrors({});
                        }}
                        errorMessage={errors.email}
                    />
                    <FormTextInput label="Phone" keyboardType="phone-pad" value={phone} editable={ready} onChangeText={setPhone} />
                    <FormTextInput label="Address" value={address} editable={ready} onChangeText={setAddress} multiline />

                    {!!errors.form && (
                        <View style={styles.messageBox}>
                            <Text style={styles.errorText}>{errors.form}</Text>
                        </View>
                    )}

                    <FormActions submitLabel="Save" onSubmit={handleSubmit} onCancel={onBack} loading={submitting} disabled={!ready} />
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
}));
