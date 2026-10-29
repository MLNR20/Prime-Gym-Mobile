import { ScrollView, StyleSheet, View } from 'react-native';
import ContactForm, { type ContactFormValues } from '../../components/ContactForm';
import DetailsNavbar from '../../components/DetailsNavbar';
import type { Contact } from '../../models/Contact';

type AddContactScreenProps = {
    editingContact: Contact | null;
    onSubmit: (values: ContactFormValues) => void;
    onCancel: () => void;
};

export default function AddContactScreen({ editingContact, onSubmit, onCancel }: AddContactScreenProps) {
    return (
        <View style={styles.screen}>
            <DetailsNavbar title={editingContact ? 'Edit Contact' : 'Add Contact'} onBack={onCancel} bordered={false} />
            <ScrollView contentContainerStyle={styles.content}>
                <ContactForm editingContact={editingContact} onSubmit={onSubmit} onCancel={onCancel} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        paddingHorizontal: 32,
        paddingVertical: 24,
    },
});
