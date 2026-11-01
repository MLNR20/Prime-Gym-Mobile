import { ScrollView, StyleSheet, View } from 'react-native';
import AttendanceForm, { type AttendanceFormValues } from '../../components/AttendanceForm';
import DetailsNavbar from '../../components/DetailsNavbar';
import type { AttendanceRecord } from '../../models/AttendanceRecord';
import type { LockerKey } from '../../models/LockerKey';
import type { Member } from '../../models/Member';
import { palette, themedStyles } from '../../utils/theme';

type AddAttendanceScreenProps = {
    editingRecord: AttendanceRecord | null;
    members: Member[];
    lockerKeys: LockerKey[];
    onSubmit: (values: AttendanceFormValues) => void;
    onCancel: () => void;
};

export default function AddAttendanceScreen({
    editingRecord,
    members,
    lockerKeys,
    onSubmit,
    onCancel,
}: AddAttendanceScreenProps) {
    return (
        <View style={styles.screen}>
            <DetailsNavbar title={editingRecord ? 'Edit Attendance' : 'Add Attendance'} onBack={onCancel} bordered={false} />
            <ScrollView contentContainerStyle={styles.content}>
                <AttendanceForm
                    editingRecord={editingRecord}
                    members={members}
                    lockerKeys={lockerKeys}
                    onSubmit={onSubmit}
                    onCancel={onCancel}
                />
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
