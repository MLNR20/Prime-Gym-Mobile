import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { IconButton } from "react-native-paper";
import AddEquipmentScreen from "./AddEquipmentScreen";
import EquipmentDetailsScreen from "./EquipmentDetailsScreen";
import SearchNavbar from "../../components/SearchNavbar";
import type { EquipmentFormValues } from "../../components/EquipmentForm";
import EquipmentListCard from "../../components/EquipmentListCard";
import type { Equipment } from "../../models/Equipment";
import { useEquipmentViewModel } from "../../viewmodels/useEquipmentViewModel";

type EquipmentScreenProps = {
  onBack: () => void;
};

export default function EquipmentScreen({ onBack }: EquipmentScreenProps) {
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
          removeEquipment(viewingEquipment);
          setViewingEquipment(null);
        }}
      />
    );
  }

  return (
    <View style={styles.screen}>
      <SearchNavbar
        title="Equipment"
        onBack={onBack}
        onAddPress={() => setIsAdding(true)}
        onBellPress={() => {}}
        searchPlaceholder="Search equipment"
        query={query}
        onQueryChange={setQuery}
      />
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
