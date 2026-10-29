export type MuscleGroup = 'Chest' | 'Back' | 'Shoulders' | 'Arms' | 'Legs' | 'Core' | 'Cardio' | 'Full Body' | 'Other';

export type Exercise = {
    id: string;
    name: string;
    description: string;
    muscle_group: MuscleGroup;
    /** The program this exercise is assigned to; '' when unassigned. */
    program_id: string;
    date_created: string;
    date_updated: string;
};

export type NewExercise = Omit<Exercise, 'id'>;
