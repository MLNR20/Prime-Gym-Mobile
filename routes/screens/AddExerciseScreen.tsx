import { ScrollView, StyleSheet, View } from 'react-native';
import ExerciseForm, { type ExerciseFormValues } from '../../components/ExerciseForm';
import DetailsNavbar from '../../components/DetailsNavbar';
import type { Exercise } from '../../models/Exercise';
import type { Program } from '../../models/Program';

type AddExerciseScreenProps = {
    editingExercise: Exercise | null;
    programs: Program[];
    onSubmit: (values: ExerciseFormValues) => void;
    onCancel: () => void;
};

export default function AddExerciseScreen({ editingExercise, programs, onSubmit, onCancel }: AddExerciseScreenProps) {
    return (
        <View style={styles.screen}>
            <DetailsNavbar title={editingExercise ? 'Edit Exercise' : 'Add Exercise'} onBack={onCancel} bordered={false} />
            <ScrollView contentContainerStyle={styles.content}>
                <ExerciseForm editingExercise={editingExercise} programs={programs} onSubmit={onSubmit} onCancel={onCancel} />
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
