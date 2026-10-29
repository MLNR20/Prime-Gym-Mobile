import { ScrollView, StyleSheet, View } from 'react-native';
import ProgramForm, { type ProgramFormValues } from '../../components/ProgramForm';
import DetailsNavbar from '../../components/DetailsNavbar';
import type { Program } from '../../models/Program';

type AddProgramScreenProps = {
    editingProgram: Program | null;
    onSubmit: (values: ProgramFormValues) => void;
    onCancel: () => void;
};

export default function AddProgramScreen({ editingProgram, onSubmit, onCancel }: AddProgramScreenProps) {
    return (
        <View style={styles.screen}>
            <DetailsNavbar title={editingProgram ? 'Edit Program' : 'Add Program'} onBack={onCancel} bordered={false} />
            <ScrollView contentContainerStyle={styles.content}>
                <ProgramForm editingProgram={editingProgram} onSubmit={onSubmit} onCancel={onCancel} />
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
