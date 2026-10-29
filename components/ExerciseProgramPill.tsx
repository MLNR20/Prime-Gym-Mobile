import Pill from './Pill';

type ExerciseProgramPillProps = {
    /** Name of the program the exercise is assigned to; '' when it has none. */
    programName: string;
};

export default function ExerciseProgramPill({ programName }: ExerciseProgramPillProps) {
    return programName ? (
        <Pill label={programName} variant="success" />
    ) : (
        <Pill label="Unassigned" variant="warning" />
    );
}
