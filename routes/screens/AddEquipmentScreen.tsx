import { ScrollView, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';
import EquipmentForm, { type EquipmentFormValues } from '../../components/EquipmentForm';
import { dashboardScreenStyles } from '../../components/commonStyles';
import type { Equipment } from '../../models/Equipment';

type AddEquipmentScreenProps = {
    editingEquipment: Equipment | null;
    onSubmit: (values: EquipmentFormValues) => void;
    onCancel: () => void;
};

export default function AddEquipmentScreen({ editingEquipment, onSubmit, onCancel }: AddEquipmentScreenProps) {
    return (
        <ScrollView style={dashboardScreenStyles.scrollView} contentContainerStyle={dashboardScreenStyles.content}>
            <IconButton icon="arrow-left" onPress={onCancel} style={styles.backButton} />
            <EquipmentForm editingEquipment={editingEquipment} onSubmit={onSubmit} onCancel={onCancel} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    backButton: {
        margin: 0,
    },
});
