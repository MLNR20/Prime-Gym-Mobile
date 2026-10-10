import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";
import { IconButton, Searchbar } from "react-native-paper";
import AddEquipmentScreen from "./AddEquipmentScreen";
import EquipmentDetailsScreen from "./EquipmentDetailsScreen";
import LabelHeaderNav from "../../components/LabelHeaderNav";
import type { EquipmentFormValues } from "../../components/EquipmentForm";
import EquipmentListCard from "../../components/EquipmentListCard";
import { commonStyles } from "../../components/commonStyles";
import type { Equipment } from "../../models/Equipment";
import { useEquipmentViewModel } from "../../viewmodels/useEquipmentViewModel";

export default function EquipmentScreen() {
  const {
    equipment,
    query,
    setQuery,
    loading,
    error,
    editingEquipment,
    startEditing,
    cancelEditing,
    submitEquipment,
    removeEquipment,
  } = useEquipmentViewModel();
  const [isAdding, setIsAdding] = useState(false);
  const [viewingEquipment, setViewingEquipment] = useState<Equipment | null>(null);

  const closeForm = () => {
    setIsAdding(false);
    cancelEditing();
  };

  const handleSubmit = async (values: EquipmentFormValues) => {
    await submitEquipment(values);
    setIsAdding(false);
  };

  if (isAdding || editingEquipment) {
    return (
      <AddEquipmentScreen
        editingEquipment={editingEquipment}
        onSubmit={handleSubmit}
        onCancel={closeForm}
      />
    );
  }

  if (viewingEquipment) {
    return (
      <EquipmentDetailsScreen
        equipment={viewingEquipment}
        onBack={() => setViewingEquipment(null)}
        onEdit={() => {
          setViewingEquipment(null);
          startEditing(viewingEquipment);
        }}
        onDelete={() => {
          removeEquipment(viewingEquipment.id);
          setViewingEquipment(null);
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
          label="Equipment"
          onNavigate={() => setIsAdding(true)}
        />
        <Searchbar
          placeholder="Search equipment"
          onChangeText={setQuery}
          style={[commonStyles.searchBar, styles.searchBar]}
          inputStyle={styles.searchInput}
          placeholderTextColor="#9CA3AF"
          value={query}
        />
      </LinearGradient>
      <View style={styles.content}>
        <View style={styles.listWrapper}>
          <EquipmentListCard
            equipment={equipment}
            query={query}
            onQueryChange={setQuery}
            loading={loading}
            error={error}
            showSearchBar={false}
            onItemPress={(item) => setViewingEquipment(item)}
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
