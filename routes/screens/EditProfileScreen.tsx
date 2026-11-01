import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import DetailsNavbar from '../../components/DetailsNavbar';
import FormActions from '../../components/FormActions';
import FormTextInput from '../../components/FormTextInput';
import { updateDisplayName } from '../../viewmodels/useAuthViewModel';
import { palette, themedStyles } from '../../utils/theme';

type EditProfileScreenProps = {
    initialName: string;
    email: string;
    onSaved: (name: string) => void;
    onBack: () => void;
};

export default function EditProfileScreen({ initialName, email, onSaved, onBack }: EditProfileScreenProps) {
    const [name, setName] = useState(initialName);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<{ name?: string; form?: string }>({});

    const handleSubmit = async () => {
        const trimmed = name.trim();
        if (!trimmed) {
            setErrors({ name: 'Enter your name.' });
            return;
        }
        setErrors({});
        setSubmitting(true);
        try {
            await updateDisplayName(trimmed);
            onSaved(trimmed);
            onBack();
        } catch (err) {
            setErrors({ form: (err as Error).message });
            setSubmitting(false);
        }
    };

    return (
        <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <DetailsNavbar title="Edit Profile" onBack={onBack} bordered={false} />
            <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                <View style={styles.form}>
                    <FormTextInput
                        label="Name"
                        value={name}
                        autoComplete="name"
                        onChangeText={(text) => {
                            setName(text);
                            setErrors({});
                        }}
                        onSubmitEditing={handleSubmit}
                        errorMessage={errors.name}
                    />
                    {/* Changing the sign-in email needs a verification step, so it is shown but not editable here. */}
                    <FormTextInput label="Email" value={email} editable={false} />

                    {!!errors.form && (
                        <View style={styles.errorBox}>
                            <Text style={styles.errorText}>{errors.form}</Text>
                        </View>
                    )}

                    <FormActions submitLabel="Save" onSubmit={handleSubmit} onCancel={onBack} loading={submitting} />
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
    errorBox: {
        paddingHorizontal: 4,
    },
    errorText: {
        color: palette.dangerText,
        fontSize: 12,
        fontFamily: 'Poppins_500Medium',
    },
}));
