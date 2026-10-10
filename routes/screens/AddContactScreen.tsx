import { ScrollView, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';
import ContactForm, { type ContactFormValues } from '../../components/ContactForm';
import { dashboardScreenStyles } from '../../components/commonStyles';
import type { Contact } from '../../models/Contact';

type AddContactScreenProps = {
    editingContact: Contact | null;
    onSubmit: (values: ContactFormValues) => void;
    onCancel: () => void;
};

export default function AddContactScreen({ editingContact, onSubmit, onCancel }: AddContactScreenProps) {
    return (
        <ScrollView style={dashboardScreenStyles.scrollView} contentContainerStyle={dashboardScreenStyles.content}>
            <IconButton icon="arrow-left" onPress={onCancel} style={styles.backButton} />
            <ContactForm editingContact={editingContact} onSubmit={onSubmit} onCancel={onCancel} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    backButton: {
        margin: 0,
    },
});
