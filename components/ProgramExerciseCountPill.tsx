import Pill from './Pill';

type ProgramExerciseCountPillProps = {
    count: number;
};

export default function ProgramExerciseCountPill({ count }: ProgramExerciseCountPillProps) {
    return count > 0 ? (
        <Pill label={`${count} ${count === 1 ? 'exercise' : 'exercises'}`} variant="success" />
    ) : (
        <Pill label="No exercises" variant="warning" />
    );
}
