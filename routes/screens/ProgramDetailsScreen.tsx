import DetailSection from '../../components/DetailSection';
import DetailsHeader from '../../components/DetailsHeader';
import DetailsScreenLayout from '../../components/DetailsScreenLayout';
import ProgramExerciseCountPill from '../../components/ProgramExerciseCountPill';
import type { Exercise } from '../../models/Exercise';
import type { Program } from '../../models/Program';
import { formatPhilippineTimestamp } from '../../utils/dateTime';

type ProgramDetailsScreenProps = {
    program: Program;
    /** Exercises currently assigned to this program. */
    exercises: Exercise[];
    onBack: () => void;
    onEdit: () => void;
    onDelete: () => void;
};

export default function ProgramDetailsScreen({ program, exercises, onBack, onEdit, onDelete }: ProgramDetailsScreenProps) {
    return (
        <DetailsScreenLayout onBack={onBack} onEdit={onEdit} footerText="Deleting a program keeps its exercises and unassigns them">
            <DetailSection
                header={
                    <DetailsHeader title={program.name} subtitle={program.description || 'No description'} onDelete={onDelete} deleteLabel="Delete program">
                        <ProgramExerciseCountPill count={exercises.length} />
                    </DetailsHeader>
                }
                title="Program Information"
                description="Exercises assigned to this program and when it changed."
                rows={[
                    {
                        label: 'Exercises',
                        value: exercises.length > 0 ? exercises.map((exercise) => exercise.name).join('\n') : '—',
                        fullWidth: true,
                    },
                    { label: 'Date Created', value: formatPhilippineTimestamp(program.date_created) },
                    { label: 'Date Updated', value: formatPhilippineTimestamp(program.date_updated) },
                ]}
            />
        </DetailsScreenLayout>
    );
}
