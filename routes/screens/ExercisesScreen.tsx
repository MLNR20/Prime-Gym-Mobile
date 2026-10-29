import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { IconButton } from "react-native-paper";
import AddExerciseScreen from "./AddExerciseScreen";
import ExerciseDetailsScreen from "./ExerciseDetailsScreen";
import SearchNavbar from "../../components/SearchNavbar";
import type { ExerciseFormValues } from "../../components/ExerciseForm";
import ExerciseListCard from "../../components/ExerciseListCard";
import type { Exercise } from "../../models/Exercise";
import { useExercisesViewModel } from "../../viewmodels/useExercisesViewModel";

type ExercisesScreenProps = {
  onBack: () => void;
};

export default function ExercisesScreen({ onBack }: ExercisesScreenProps) {
  const {
    exercises,
    programs,
    programNameFor,
    query,
    setQuery,
    loading,
    error,
    editingExercise,
    startEditing,
    cancelEditing,
    submitExercise,
    removeExercise,
  } = useExercisesViewModel();
  const [isAdding, setIsAdding] = useState(false);
  const [viewingExercise, setViewingExercise] = useState<Exercise | null>(null);

  const closeForm = () => {
    setIsAdding(false);
    cancelEditing();
  };

  const handleSubmit = async (values: ExerciseFormValues) => {
    await submitExercise(values);
    setIsAdding(false);
  };

  if (isAdding || editingExercise) {
    return (
      <AddExerciseScreen
        editingExercise={editingExercise}
        programs={programs}
        onSubmit={handleSubmit}
        onCancel={closeForm}
      />
    );
  }

  if (viewingExercise) {
    return (
      <ExerciseDetailsScreen
        exercise={viewingExercise}
        programName={programNameFor(viewingExercise)}
        onBack={() => setViewingExercise(null)}
        onEdit={() => {
          setViewingExercise(null);
          startEditing(viewingExercise);
        }}
        onDelete={() => {
          removeExercise(viewingExercise);
          setViewingExercise(null);
        }}
      />
    );
  }

  return (
    <View style={styles.screen}>
      <SearchNavbar
        title="Exercises"
        onBack={onBack}
        onAddPress={() => setIsAdding(true)}
        onBellPress={() => {}}
        searchPlaceholder="Search exercises"
        query={query}
        onQueryChange={setQuery}
      />
      <View style={styles.content}>
        <View style={styles.listWrapper}>
          <ExerciseListCard
            exercises={exercises}
            programNameFor={programNameFor}
            query={query}
            onQueryChange={setQuery}
            loading={loading}
            error={error}
            showSearchBar={false}
            onItemPress={(exercise) => setViewingExercise(exercise)}
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
