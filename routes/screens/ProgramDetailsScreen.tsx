import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import AssignSubscriberDialog from '../../components/AssignSubscriberDialog';
import { commonStyles } from '../../components/commonStyles';
import DetailSection from '../../components/DetailSection';
import DetailsHeader from '../../components/DetailsHeader';
import DetailsScreenLayout from '../../components/DetailsScreenLayout';
import ProgramExerciseCountPill from '../../components/ProgramExerciseCountPill';
import type { Exercise } from '../../models/Exercise';
import type { Member } from '../../models/Member';
import type { Program } from '../../models/Program';
import { formatPhilippineDate } from '../../utils/dateTime';

type ProgramDetailsScreenProps = {
    program: Program;
    /** Exercises currently assigned to this program. */
    exercises: Exercise[];
    /** Subscribers currently assigned to this program. */
    assignedSubscribers: Member[];
    /** Every subscriber, for the assign picker. */
    subscribers: Member[];
    /** Rejects with a user-facing message when the subscriber can't be assigned (e.g. expired). */
    onAssign: (member: Member) => Promise<void>;
    onBack: () => void;
    onEdit: () => void;
    onDelete: () => void;
};

export default function ProgramDetailsScreen({
    program,
    exercises,
    assignedSubscribers,
    subscribers,
    onAssign,
    onBack,
    onEdit,
    onDelete,
}: ProgramDetailsScreenProps) {
    const [assigning, setAssigning] = useState(false);

    return (
        <DetailsScreenLayout onBack={onBack} onEdit={onEdit} footerText="Deleting a program keeps its exercises and subscribers and unassigns them">
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
                    { label: 'Date Created', value: formatPhilippineDate(program.date_created) },
                    { label: 'Date Updated', value: formatPhilippineDate(program.date_updated) },
                ]}
            />
            <DetailSection
                title="Subscribers"
                description="Subscribers following this program. Only active subscriptions can be assigned."
                rows={[
                    {
                        label: 'Assigned Subscribers',
                        value:
                            assignedSubscribers.length > 0
                                ? assignedSubscribers.map((member) => `${member.first_name} ${member.last_name}`).join('\n')
                                : '—',
                        fullWidth: true,
                    },
                ]}
            />
            <Button
                mode="contained"
                icon="account-plus-outline"
                textColor="#fff"
                contentStyle={commonStyles.submitButtonContent}
                labelStyle={styles.buttonLabel}
                style={commonStyles.submitButton}
                onPress={() => setAssigning(true)}
            >
                Assign to Subscriber
            </Button>
            <AssignSubscriberDialog
                visible={assigning}
                programName={program.name}
                programId={program.id}
                subscribers={subscribers}
                onAssign={onAssign}
                onDismiss={() => setAssigning(false)}
            />
        </DetailsScreenLayout>
    );
}

const styles = StyleSheet.create({
    // Matches the submit buttons on the forms (Paper's 14px label + 0.2rem).
    buttonLabel: {
        fontSize: 17.2,
        lineHeight: 24,
    },
});
