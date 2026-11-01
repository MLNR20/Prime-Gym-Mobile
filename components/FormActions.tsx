import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import { commonStyles } from './commonStyles';
import { palette, themedStyles } from '../utils/theme';

type FormActionsProps = {
    submitLabel: string;
    onSubmit: () => void;
    /** Omit to hide the Cancel button (e.g. when adding rather than editing). */
    onCancel?: () => void;
    cancelLabel?: string;
    /** Shows a spinner on Save and disables both buttons. */
    loading?: boolean;
    /** Disables Save only. */
    disabled?: boolean;
};

// Save on top, outlined Cancel below: the button pair shared by every add/edit view.
export default function FormActions({ submitLabel, onSubmit, onCancel, cancelLabel = 'Cancel', loading = false, disabled = false }: FormActionsProps) {
    return (
        <View style={styles.actions}>
            <Button
                mode="contained"
                textColor="#fff"
                contentStyle={commonStyles.formActionButtonContent}
                labelStyle={styles.buttonLabel}
                onPress={onSubmit}
                loading={loading}
                disabled={loading || disabled}
                style={commonStyles.submitButton}
            >
                {submitLabel}
            </Button>
            {onCancel && (
                <Button
                    mode="outlined"
                    textColor={palette.muted}
                    contentStyle={commonStyles.formActionButtonContent}
                    labelStyle={styles.buttonLabel}
                    onPress={onCancel}
                    disabled={loading}
                    style={styles.cancelButton}
                >
                    {cancelLabel}
                </Button>
            )}
        </View>
    );
}

const styles = themedStyles(() => StyleSheet.create({
    actions: {
        width: '100%',
        gap: 16,
    },
    // Paper's default button label is 14px; +0.1rem (1.6px).
    buttonLabel: {
        fontSize: 15.6,
        lineHeight: 24,
    },
    cancelButton: {
        width: '100%',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: palette.text,
    },
}));
