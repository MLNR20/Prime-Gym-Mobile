import { ScrollView, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';
import LockerKeyForm, { type LockerKeyFormValues } from '../../components/LockerKeyForm';
import { dashboardScreenStyles } from '../../components/commonStyles';
import type { LockerKey } from '../../models/LockerKey';

type AddLockerKeyScreenProps = {
    editingLockerKey: LockerKey | null;
    onSubmit: (values: LockerKeyFormValues) => void;
    onCancel: () => void;
};

export default function AddLockerKeyScreen({ editingLockerKey, onSubmit, onCancel }: AddLockerKeyScreenProps) {
    return (
        <ScrollView style={dashboardScreenStyles.scrollView} contentContainerStyle={dashboardScreenStyles.content}>
            <IconButton icon="arrow-left" onPress={onCancel} style={styles.backButton} />
            <LockerKeyForm editingLockerKey={editingLockerKey} onSubmit={onSubmit} onCancel={onCancel} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    backButton: {
        margin: 0,
    },
});
