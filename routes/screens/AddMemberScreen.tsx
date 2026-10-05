import { ScrollView, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';
import MemberForm, { type MemberFormValues } from '../../components/MemberForm';
import { dashboardScreenStyles } from '../../components/commonStyles';
import type { Member } from '../../models/Member';

type AddMemberScreenProps = {
    editingMember: Member | null;
    onSubmit: (values: MemberFormValues) => void;
    onCancel: () => void;
};

export default function AddMemberScreen({ editingMember, onSubmit, onCancel }: AddMemberScreenProps) {
    return (
        <ScrollView style={dashboardScreenStyles.scrollView} contentContainerStyle={dashboardScreenStyles.content}>
            <IconButton icon="arrow-left" onPress={onCancel} style={styles.backButton} />
            <MemberForm editingMember={editingMember} onSubmit={onSubmit} onCancel={onCancel} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    backButton: {
        margin: 0,
    },
});
