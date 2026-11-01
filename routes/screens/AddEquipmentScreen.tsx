import { ScrollView, StyleSheet, View } from 'react-native';
import EquipmentForm, { type EquipmentFormValues } from '../../components/EquipmentForm';
import DetailsNavbar from '../../components/DetailsNavbar';
import type { Equipment } from '../../models/Equipment';
import { palette, themedStyles } from '../../utils/theme';

type AddEquipmentScreenProps = {
    editingEquipment: Equipment | null;
    onSubmit: (values: EquipmentFormValues) => void;
    onCancel: () => void;
};

export default function AddEquipmentScreen({ editingEquipment, onSubmit, onCancel }: AddEquipmentScreenProps) {
    return (
        <View style={styles.screen}>
            <DetailsNavbar title={editingEquipment ? 'Edit Equipment' : 'Add Equipment'} onBack={onCancel} bordered={false} />
            <ScrollView contentContainerStyle={styles.content}>
                <EquipmentForm editingEquipment={editingEquipment} onSubmit={onSubmit} onCancel={onCancel} />
            </ScrollView>
        </View>
    );
}

const styles = themedStyles(() => StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: palette.background,
    },
    content: {
        paddingHorizontal: 32,
        paddingVertical: 24,
    },
}));
