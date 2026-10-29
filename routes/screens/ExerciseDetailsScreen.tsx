import DetailSection from '../../components/DetailSection';
import DetailsHeader from '../../components/DetailsHeader';
import DetailsScreenLayout from '../../components/DetailsScreenLayout';
import ExerciseProgramPill from '../../components/ExerciseProgramPill';
import type { Exercise } from '../../models/Exercise';
import { formatPhilippineDate } from '../../utils/dateTime';

type ExerciseDetailsScreenProps = {
    exercise: Exercise;
    /** Name of the program the exercise is assigned to; '' when it has none. */
    programName: string;
    onBack: () => void;
    onEdit: () => void;
    onDelete: () => void;
};

export default function ExerciseDetailsScreen({ exercise, programName, onBack, onEdit, onDelete }: ExerciseDetailsScreenProps) {
    return (
        <DetailsScreenLayout onBack={onBack} onEdit={onEdit} footerText="Manage your exercises right here">
            <DetailSection
                header={
                    <DetailsHeader title={exercise.name} subtitle={exercise.muscle_group} onDelete={onDelete} deleteLabel="Delete exercise">
                        <ExerciseProgramPill programName={programName} />
                    </DetailsHeader>
                }
                title="Exercise Information"
                description="Program and notes for this exercise."
                rows={[
                    { label: 'Program', value: programName || '—', fullWidth: true },
                    { label: 'Description', value: exercise.description || '—', fullWidth: true },
                    { label: 'Date Created', value: formatPhilippineDate(exercise.date_created) },
                    { label: 'Date Updated', value: formatPhilippineDate(exercise.date_updated) },
                ]}
            />
        </DetailsScreenLayout>
    );
}
