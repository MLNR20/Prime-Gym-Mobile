import { ScrollView, StyleSheet, View } from 'react-native';
import EquipmentForm, { type EquipmentFormValues } from '../../components/EquipmentForm';
import DetailsNavbar from '../../components/DetailsNavbar';
import type { Equipment } from '../../models/Equipment';

type AddEquipmentScreenProps = {
    editingEquipment: Equipment | null;
    onSubmit: (values: EquipmentFormValues) => void;
    onCancel: () => void;
};

export default function AddEquipmentScreen({ editingEquipment, onSubmit, onCancel }: AddEquipmentScreenProps) {
    return (
        <View style={styles.screen}>
            <DetailsNavbar title={editingEquipment ? 'Edit Equipment' : 'Add Equipment'} onBack={onCancel} />
            <ScrollView contentContainerStyle={styles.content}>
                <EquipmentForm editingEquipment={editingEquipment} onSubmit={onSubmit} onCancel={onCancel} />
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
