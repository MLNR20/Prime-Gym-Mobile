import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import AddAttendanceScreen from './AddAttendanceScreen';
import type { AttendanceFormValues } from '../../components/AttendanceForm';
import AttendanceListCard from '../../components/AttendanceListCard';
import SearchNavbar from '../../components/SearchNavbar';
import { useAttendanceViewModel } from '../../viewmodels/useAttendanceViewModel';

export default function AttendanceScreen() {
    const {
        rows,
        members,
        lockerKeys,
        query,
        setQuery,
        loading,
        error,
        editingRecord,
        startEditing,
        cancelEditing,
        submitRecord,
        checkOut,
    } = useAttendanceViewModel();
    const [isAdding, setIsAdding] = useState(false);

    const closeForm = () => {
        setIsAdding(false);
        cancelEditing();
    };

    const handleSubmit = async (values: AttendanceFormValues) => {
        await submitRecord(values);
        setIsAdding(false);
    };

    if (isAdding || editingRecord) {
        return (
            <AddAttendanceScreen
                editingRecord={editingRecord}
                members={members}
                lockerKeys={lockerKeys}
                onSubmit={handleSubmit}
                onCancel={closeForm}
            />
        );
    }

    return (
        <View style={styles.screen}>
            <SearchNavbar
                title="Attendance"
                onAddPress={() => setIsAdding(true)}
                searchPlaceholder="Search attendance"
                query={query}
                onQueryChange={setQuery}
            />
            <View style={styles.content}>
                <AttendanceListCard
                    rows={rows}
                    loading={loading}
                    error={error}
                    onItemPress={startEditing}
                    renderRight={(row) =>
                        row.time_out ? (
                            <IconButton icon="check-circle" iconColor="#166534" size={22} style={styles.action} />
                        ) : (
                            <IconButton icon="logout" size={22} style={styles.action} onPress={() => checkOut(row)} />
                        )
                    }
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        paddingHorizontal: 32,
        paddingTop: 24,
    },
    action: {
        margin: 0,
    },
});
