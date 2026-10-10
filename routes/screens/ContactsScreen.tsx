import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";
import { IconButton, Searchbar } from "react-native-paper";
import AddContactScreen from "./AddContactScreen";
import ContactDetailsScreen from "./ContactDetailsScreen";
import LabelHeaderNav from "../../components/LabelHeaderNav";
import type { ContactFormValues } from "../../components/ContactForm";
import ContactListCard from "../../components/ContactListCard";
import { commonStyles } from "../../components/commonStyles";
import type { Contact } from "../../models/Contact";
import { useContactsViewModel } from "../../viewmodels/useContactsViewModel";

export default function ContactsScreen() {
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
          removeContact(viewingContact.id);
          setViewingContact(null);
        }}
      />
    );
  }

  return (
    <View style={styles.screen}>
      <LinearGradient
        colors={["#F59E0B", "#FFC107"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <LabelHeaderNav
          label="Contacts"
          onNavigate={() => setIsAdding(true)}
        />
        <Searchbar
          placeholder="Search contacts"
          onChangeText={setQuery}
          style={[commonStyles.searchBar, styles.searchBar]}
          inputStyle={styles.searchInput}
          placeholderTextColor="#9CA3AF"
          value={query}
        />
      </LinearGradient>
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
  header: {
    height: "28%",
    justifyContent: "flex-end",
    paddingHorizontal: 32,
    paddingBottom: 24,
    gap: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 24,
    gap: 12,
  },
  searchBar: {
    width: "100%",
  },
  searchInput: {
    color: "#374151",
  },
  listWrapper: {
    width: "100%",
    flex: 1,
  },
  chevron: {
    margin: 0,
  },
});
