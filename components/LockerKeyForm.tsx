import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, SegmentedButtons, Text } from 'react-native-paper';
import type { LockerKey, LockerKeyStatus } from '../models/LockerKey';
import { LOCKER_KEY_STATUSES } from '../utils/lockerKeyStatus';
import { commonStyles } from './commonStyles';
import FormTextInput, { FormLabel } from './FormTextInput';

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
            <FormTextInput label="Locker Number" value={lockerNumber} onChangeText={setLockerNumber} />
            <FormTextInput label="Key Code" value={keyCode} onChangeText={setKeyCode} />
            <View style={styles.group}>
                <FormLabel>Status</FormLabel>
                <SegmentedButtons
                    value={status}
                    onValueChange={(value) => setStatus(value as LockerKeyStatus)}
                    buttons={LOCKER_KEY_STATUSES.map((statusOption) => ({ value: statusOption, label: statusOption }))}
                />
            </View>
            <FormTextInput
                label="Assigned To"
                value={assignedTo}
                onChangeText={setAssignedTo}
            />

            <View style={styles.actions}>
                {editingLockerKey && (
                    <Button mode="text" textColor="#6B7280" onPress={onCancel}>
                        Cancel
                    </Button>
                )}
                <Button mode="contained" textColor="#fff" contentStyle={commonStyles.submitButtonContent} onPress={handleSubmit} style={commonStyles.submitButton}>
                    {editingLockerKey ? 'Save' : 'Add'}
                </Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        gap: 20,
    },
    group: {
        width: '100%',
        gap: 6,
    },
    actions: {
        width: '100%',
        gap: 8,
    },
});
