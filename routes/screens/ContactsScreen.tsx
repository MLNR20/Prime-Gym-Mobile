import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { IconButton } from "react-native-paper";
import AddContactScreen from "./AddContactScreen";
import ContactDetailsScreen from "./ContactDetailsScreen";
import SearchNavbar from "../../components/SearchNavbar";
import type { ContactFormValues } from "../../components/ContactForm";
import ContactListCard from "../../components/ContactListCard";
import type { Contact } from "../../models/Contact";
import { useContactsViewModel } from "../../viewmodels/useContactsViewModel";

type ContactsScreenProps = {
  onBack: () => void;
};

export default function ContactsScreen({ onBack }: ContactsScreenProps) {
  const {
    contacts,
    query,
    setQuery,
    loading,
    error,
    editingContact,
    startEditing,
    cancelEditing,
    submitContact,
    removeContact,
  } = useContactsViewModel();
  const [isAdding, setIsAdding] = useState(false);
  const [viewingContact, setViewingContact] = useState<Contact | null>(null);

  const closeForm = () => {
    setIsAdding(false);
    cancelEditing();
  };

  const handleSubmit = async (values: ContactFormValues) => {
    await submitContact(values);
    setIsAdding(false);
  };

  if (isAdding || editingContact) {
    return (
      <AddContactScreen
        editingContact={editingContact}
        onSubmit={handleSubmit}
        onCancel={closeForm}
      />
    );
  }

  if (viewingContact) {
    return (
      <ContactDetailsScreen
        contact={viewingContact}
        onBack={() => setViewingContact(null)}
        onEdit={() => {
          setViewingContact(null);
          startEditing(viewingContact);
        }}
        onDelete={() => {
          removeContact(viewingContact);
          setViewingContact(null);
        }}
      />
    );
  }

  return (
    <View style={styles.screen}>
      <SearchNavbar
        title="Contacts"
        onBack={onBack}
        onAddPress={() => setIsAdding(true)}
        onBellPress={() => {}}
        searchPlaceholder="Search contacts"
        query={query}
        onQueryChange={setQuery}
      />
      <View style={styles.content}>
        <View style={styles.listWrapper}>
          <ContactListCard
            contacts={contacts}
            query={query}
            onQueryChange={setQuery}
            loading={loading}
            error={error}
            showSearchBar={false}
            onItemPress={(contact) => setViewingContact(contact)}
            renderRight={() => (
              <IconButton icon="chevron-right" size={22} style={styles.chevron} />
            )}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 24,
    gap: 12,
  },
  listWrapper: {
    width: "100%",
    flex: 1,
  },
  chevron: {
    margin: 0,
  },
});
