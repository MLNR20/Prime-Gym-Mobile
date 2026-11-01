import { ScrollView, StyleSheet, View } from 'react-native';
import ProgramForm, { type ProgramFormValues } from '../../components/ProgramForm';
import DetailsNavbar from '../../components/DetailsNavbar';
import type { Program } from '../../models/Program';
import { palette, themedStyles } from '../../utils/theme';

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
