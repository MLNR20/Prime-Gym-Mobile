import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import type { LockerKey, LockerKeyStatus } from '../models/LockerKey';
import { LOCKER_KEY_STATUSES } from '../utils/lockerKeyStatus';
import FormSelect from './FormSelect';
import FormActions from './FormActions';
import FormTextInput from './FormTextInput';

const STATUS_OPTIONS = LOCKER_KEY_STATUSES.map((statusOption) => ({ value: statusOption, label: statusOption }));

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
            <FormSelect label="Status" value={status} options={STATUS_OPTIONS} onChange={setStatus} />
            <FormTextInput
                label="Assigned To"
                value={assignedTo}
                onChangeText={setAssignedTo}
            />

            <FormActions submitLabel={editingLockerKey ? 'Save' : 'Add'} onSubmit={handleSubmit} onCancel={editingLockerKey ? onCancel : undefined} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        gap: 20,
    },
});
