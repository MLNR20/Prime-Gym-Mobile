import { ScrollView, StyleSheet, View } from 'react-native';
import MemberForm, { type MemberFormValues } from '../../components/MemberForm';
import DetailsNavbar from '../../components/DetailsNavbar';
import type { Member } from '../../models/Member';

type AddMemberScreenProps = {
    editingMember: Member | null;
    onSubmit: (values: MemberFormValues) => void;
    onCancel: () => void;
};

export default function AddMemberScreen({ editingMember, onSubmit, onCancel }: AddMemberScreenProps) {
    return (
        <View style={styles.screen}>
            <DetailsNavbar title={editingMember ? 'Edit Subscriber' : 'Add Subscriber'} onBack={onCancel} bordered={false} />
            <ScrollView contentContainerStyle={styles.content}>
                <MemberForm editingMember={editingMember} onSubmit={onSubmit} onCancel={onCancel} />
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
