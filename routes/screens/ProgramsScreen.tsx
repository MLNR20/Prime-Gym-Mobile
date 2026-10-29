import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { IconButton } from "react-native-paper";
import AddProgramScreen from "./AddProgramScreen";
import ProgramDetailsScreen from "./ProgramDetailsScreen";
import SearchNavbar from "../../components/SearchNavbar";
import type { ProgramFormValues } from "../../components/ProgramForm";
import ProgramListCard from "../../components/ProgramListCard";
import type { Program } from "../../models/Program";
import { useProgramsViewModel } from "../../viewmodels/useProgramsViewModel";

type ProgramsScreenProps = {
  onBack: () => void;
};

export default function ProgramsScreen({ onBack }: ProgramsScreenProps) {
  const {
    programs,
    exercisesFor,
    query,
    setQuery,
    loading,
    error,
    editingProgram,
    startEditing,
    cancelEditing,
    submitProgram,
    removeProgram,
  } = useProgramsViewModel();
  const [isAdding, setIsAdding] = useState(false);
  const [viewingProgram, setViewingProgram] = useState<Program | null>(null);

  const closeForm = () => {
    setIsAdding(false);
    cancelEditing();
  };

  const handleSubmit = async (values: ProgramFormValues) => {
    await submitProgram(values);
    setIsAdding(false);
  };

  if (isAdding || editingProgram) {
    return (
      <AddProgramScreen
        editingProgram={editingProgram}
        onSubmit={handleSubmit}
        onCancel={closeForm}
      />
    );
  }

  if (viewingProgram) {
    return (
      <ProgramDetailsScreen
        program={viewingProgram}
        exercises={exercisesFor(viewingProgram)}
        onBack={() => setViewingProgram(null)}
        onEdit={() => {
          setViewingProgram(null);
          startEditing(viewingProgram);
        }}
        onDelete={() => {
          removeProgram(viewingProgram);
          setViewingProgram(null);
        }}
      />
    );
  }

  return (
    <View style={styles.screen}>
      <SearchNavbar
        title="Programs"
        onBack={onBack}
        onAddPress={() => setIsAdding(true)}
        onBellPress={() => {}}
        searchPlaceholder="Search programs"
        query={query}
        onQueryChange={setQuery}
      />
      <View style={styles.content}>
        <View style={styles.listWrapper}>
          <ProgramListCard
            programs={programs}
            exerciseCountFor={(program) => exercisesFor(program).length}
            query={query}
            onQueryChange={setQuery}
            loading={loading}
            error={error}
            showSearchBar={false}
            onItemPress={(program) => setViewingProgram(program)}
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
