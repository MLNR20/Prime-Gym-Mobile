import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";
import { IconButton, Searchbar } from "react-native-paper";
import AddLockerKeyScreen from "./AddLockerKeyScreen";
import LockerKeyDetailsScreen from "./LockerKeyDetailsScreen";
import LabelHeaderNav from "../../components/LabelHeaderNav";
import type { LockerKeyFormValues } from "../../components/LockerKeyForm";
import LockerKeyListCard from "../../components/LockerKeyListCard";
import { commonStyles } from "../../components/commonStyles";
import type { LockerKey } from "../../models/LockerKey";
import { useLockerKeysViewModel } from "../../viewmodels/useLockerKeysViewModel";

export default function LockerKeysScreen() {
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
      <LinearGradient
        colors={["#F59E0B", "#FFC107"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <LabelHeaderNav
          label="Locker Keys"
          onNavigate={() => setIsAdding(true)}
        />
        <Searchbar
          placeholder="Search locker keys"
          onChangeText={setQuery}
          style={[commonStyles.searchBar, styles.searchBar]}
          inputStyle={styles.searchInput}
          placeholderTextColor="#9CA3AF"
          value={query}
        />
      </LinearGradient>
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
