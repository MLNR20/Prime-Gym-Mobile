import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, SegmentedButtons, Text, TextInput } from 'react-native-paper';
import type { LockerKey, LockerKeyStatus } from '../models/LockerKey';
import { LOCKER_KEY_STATUSES } from '../utils/lockerKeyStatus';
import { commonStyles } from './commonStyles';

export type LockerKeyFormValues = {
    locker_number: string;
    key_code: string;
    status: LockerKeyStatus;
    assigned_to: string;
};

type LockerKeyFormProps = {
    editingLockerKey: LockerKey | null;
    onSubmit: (values: LockerKeyFormValues) => void;
    onCancel: () => void;
};

export default function LockerKeyForm({ editingLockerKey, onSubmit, onCancel }: LockerKeyFormProps) {
    const [lockerNumber, setLockerNumber] = useState('');
    const [keyCode, setKeyCode] = useState('');
    const [status, setStatus] = useState<LockerKeyStatus>('Available');
    const [assignedTo, setAssignedTo] = useState('');

    useEffect(() => {
        setLockerNumber(editingLockerKey?.locker_number ?? '');
        setKeyCode(editingLockerKey?.key_code ?? '');
        setStatus(editingLockerKey?.status ?? 'Available');
        setAssignedTo(editingLockerKey?.assigned_to ?? '');
    }, [editingLockerKey]);

    const handleSubmit = () => {
        const trimmedLockerNumber = lockerNumber.trim();
        if (!trimmedLockerNumber) return;
        onSubmit({
            locker_number: trimmedLockerNumber,
            key_code: keyCode.trim(),
            status,
            assigned_to: assignedTo.trim(),
        });
        if (!editingLockerKey) {
            setLockerNumber('');
            setKeyCode('');
            setStatus('Available');
            setAssignedTo('');
        }
    };

    return (
        <View style={styles.container}>
            <Text className="text-lg font-poppins-bold">
                {editingLockerKey ? 'Edit Locker Key' : 'Add Locker Key'}
            </Text>
            <TextInput mode="outlined" style={commonStyles.inputField} label="Locker Number" value={lockerNumber} onChangeText={setLockerNumber} />
            <TextInput mode="outlined" style={commonStyles.inputField} label="Key Code" value={keyCode} onChangeText={setKeyCode} />
            <SegmentedButtons
                value={status}
                onValueChange={(value) => setStatus(value as LockerKeyStatus)}
                buttons={LOCKER_KEY_STATUSES.map((statusOption) => ({ value: statusOption, label: statusOption }))}
            />
            <TextInput
                mode="outlined"
                style={commonStyles.inputField}
                label="Assigned To"
                value={assignedTo}
                onChangeText={setAssignedTo}
            />

            <View style={styles.actions}>
                {editingLockerKey && (
                    <Button mode="text" onPress={onCancel}>
                        Cancel
                    </Button>
                )}
                <Button mode="contained" onPress={handleSubmit} style={commonStyles.submitButton}>
                    {editingLockerKey ? 'Save' : 'Add'}
                </Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        gap: 12,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 8,
    },
});
