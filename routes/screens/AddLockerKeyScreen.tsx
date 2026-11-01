import { ScrollView, StyleSheet, View } from 'react-native';
import LockerKeyForm, { type LockerKeyFormValues } from '../../components/LockerKeyForm';
import DetailsNavbar from '../../components/DetailsNavbar';
import type { LockerKey } from '../../models/LockerKey';
import { palette, themedStyles } from '../../utils/theme';

type AddLockerKeyScreenProps = {
    editingLockerKey: LockerKey | null;
    onSubmit: (values: LockerKeyFormValues) => void;
    onCancel: () => void;
};

export default function AddLockerKeyScreen({ editingLockerKey, onSubmit, onCancel }: AddLockerKeyScreenProps) {
    return (
        <View style={styles.screen}>
            <DetailsNavbar title={editingLockerKey ? 'Edit Locker Key' : 'Add Locker Key'} onBack={onCancel} bordered={false} />
            <ScrollView contentContainerStyle={styles.content}>
                <LockerKeyForm editingLockerKey={editingLockerKey} onSubmit={onSubmit} onCancel={onCancel} />
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
