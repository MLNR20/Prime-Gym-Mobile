import { ScrollView, StyleSheet, View } from 'react-native';
import LockerKeyForm, { type LockerKeyFormValues } from '../../components/LockerKeyForm';
import DetailsNavbar from '../../components/DetailsNavbar';
import type { LockerKey } from '../../models/LockerKey';

type AddLockerKeyScreenProps = {
    editingLockerKey: LockerKey | null;
    onSubmit: (values: LockerKeyFormValues) => void;
    onCancel: () => void;
};

export default function AddLockerKeyScreen({ editingLockerKey, onSubmit, onCancel }: AddLockerKeyScreenProps) {
    return (
        <View style={styles.screen}>
            <DetailsNavbar title={editingLockerKey ? 'Edit Locker Key' : 'Add Locker Key'} onBack={onCancel} />
            <ScrollView contentContainerStyle={styles.content}>
                <LockerKeyForm editingLockerKey={editingLockerKey} onSubmit={onSubmit} onCancel={onCancel} />
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
