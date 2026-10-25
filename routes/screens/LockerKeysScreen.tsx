import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { IconButton } from "react-native-paper";
import AddLockerKeyScreen from "./AddLockerKeyScreen";
import LockerKeyDetailsScreen from "./LockerKeyDetailsScreen";
import SearchNavbar from "../../components/SearchNavbar";
import type { LockerKeyFormValues } from "../../components/LockerKeyForm";
import LockerKeyListCard from "../../components/LockerKeyListCard";
import type { LockerKey } from "../../models/LockerKey";
import { useLockerKeysViewModel } from "../../viewmodels/useLockerKeysViewModel";

type LockerKeysScreenProps = {
  onBack: () => void;
};

export default function LockerKeysScreen({ onBack }: LockerKeysScreenProps) {
  const {
    lockerKeys,
    query,
    setQuery,
    loading,
    error,
    editingLockerKey,
    startEditing,
    cancelEditing,
    submitLockerKey,
    removeLockerKey,
  } = useLockerKeysViewModel();
  const [isAdding, setIsAdding] = useState(false);
  const [viewingLockerKey, setViewingLockerKey] = useState<LockerKey | null>(null);

  const closeForm = () => {
    setIsAdding(false);
    cancelEditing();
  };

  const handleSubmit = async (values: LockerKeyFormValues) => {
    await submitLockerKey(values);
    setIsAdding(false);
  };

  if (isAdding || editingLockerKey) {
    return (
      <AddLockerKeyScreen
        editingLockerKey={editingLockerKey}
        onSubmit={handleSubmit}
        onCancel={closeForm}
      />
    );
  }

  if (viewingLockerKey) {
    return (
      <LockerKeyDetailsScreen
        lockerKey={viewingLockerKey}
        onBack={() => setViewingLockerKey(null)}
        onEdit={() => {
          setViewingLockerKey(null);
          startEditing(viewingLockerKey);
        }}
        onDelete={() => {
          removeLockerKey(viewingLockerKey);
          setViewingLockerKey(null);
        }}
      />
    );
  }

  return (
    <View style={styles.screen}>
      <SearchNavbar
        title="Locker Keys"
        onBack={onBack}
        onAddPress={() => setIsAdding(true)}
        searchPlaceholder="Search locker keys"
        query={query}
        onQueryChange={setQuery}
      />
      <View style={styles.content}>
        <View style={styles.listWrapper}>
          <LockerKeyListCard
            lockerKeys={lockerKeys}
            query={query}
            onQueryChange={setQuery}
            loading={loading}
            error={error}
            showSearchBar={false}
            onItemPress={(lockerKey) => setViewingLockerKey(lockerKey)}
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
