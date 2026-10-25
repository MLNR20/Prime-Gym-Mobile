import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import type { AttendanceRecord } from '../models/AttendanceRecord';
import type { LockerKey } from '../models/LockerKey';
import type { Member } from '../models/Member';
import { fromInputTimestamp, nowInPhilippineTime, toInputTimestamp } from '../utils/dateTime';
import { commonStyles } from './commonStyles';
import FormSelect from './FormSelect';
import FormTextInput from './FormTextInput';

export type AttendanceFormValues = {
    member_id: string;
    locker_key_id: string;
    time_in: string;
    time_out: string;
};

type AttendanceFormProps = {
    editingRecord: AttendanceRecord | null;
    members: Member[];
    lockerKeys: LockerKey[];
    onSubmit: (values: AttendanceFormValues) => void;
    onCancel: () => void;
};

const TIME_FORMAT_HINT = 'YYYY-MM-DD HH:mm';

export default function AttendanceForm({ editingRecord, members, lockerKeys, onSubmit, onCancel }: AttendanceFormProps) {
    const [memberId, setMemberId] = useState('');
    const [lockerKeyId, setLockerKeyId] = useState('');
    const [timeIn, setTimeIn] = useState('');
    const [timeOut, setTimeOut] = useState('');
    const [formError, setFormError] = useState<string | null>(null);

    const memberOptions = useMemo(
        () => members.map((member) => ({ value: member.id, label: `${member.first_name} ${member.last_name}` })),
        [members]
    );
    const lockerKeyOptions = useMemo(
        () => lockerKeys.map((lockerKey) => ({ value: lockerKey.id, label: `Locker ${lockerKey.locker_number}` })),
        [lockerKeys]
    );

    useEffect(() => {
        setMemberId(editingRecord?.member_id ?? '');
        setLockerKeyId(editingRecord?.locker_key_id ?? '');
        // time_in defaults to the moment the form opens for a new record.
        setTimeIn(toInputTimestamp(editingRecord?.time_in ?? nowInPhilippineTime()));
        setTimeOut(toInputTimestamp(editingRecord?.time_out ?? ''));
        setFormError(null);
    }, [editingRecord]);

    const handleSubmit = () => {
        const parsedTimeIn = fromInputTimestamp(timeIn);
        const parsedTimeOut = timeOut.trim() ? fromInputTimestamp(timeOut) : '';
        if (!memberId) return setFormError('Select a member.');
        if (!lockerKeyId) return setFormError('Select a locker key.');
        if (!parsedTimeIn) return setFormError(`Time In must look like ${TIME_FORMAT_HINT}.`);
        if (parsedTimeOut === null) return setFormError(`Time Out must look like ${TIME_FORMAT_HINT}.`);
        if (parsedTimeOut && new Date(parsedTimeOut) < new Date(parsedTimeIn)) {
            return setFormError('Time Out cannot be earlier than Time In.');
        }
        setFormError(null);
        onSubmit({ member_id: memberId, locker_key_id: lockerKeyId, time_in: parsedTimeIn, time_out: parsedTimeOut });
        if (!editingRecord) {
            setMemberId('');
            setLockerKeyId('');
            setTimeIn(toInputTimestamp(nowInPhilippineTime()));
            setTimeOut('');
        }
    };

    return (
        <View style={styles.container}>
            <FormSelect label="Member" value={memberId} options={memberOptions} onChange={setMemberId} placeholder="Select member" />
            <FormSelect
                label="Locker Key"
                value={lockerKeyId}
                options={lockerKeyOptions}
                onChange={setLockerKeyId}
                placeholder="Select locker key"
            />
            <FormTextInput label="Time In" placeholder={TIME_FORMAT_HINT} value={timeIn} onChangeText={setTimeIn} />
            <FormTextInput
                label="Time Out"
                placeholder={`${TIME_FORMAT_HINT} (leave blank while still in)`}
                value={timeOut}
                onChangeText={setTimeOut}
            />
            {formError && <Text style={styles.error}>{formError}</Text>}

            <View style={styles.actions}>
                {editingRecord && (
                    <Button mode="text" textColor="#6B7280" onPress={onCancel}>
                        Cancel
                    </Button>
                )}
                <Button
                    mode="contained"
                    textColor="#fff"
                    contentStyle={commonStyles.submitButtonContent}
                    onPress={handleSubmit}
                    style={commonStyles.submitButton}
                >
                    {editingRecord ? 'Save' : 'Add'}
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
    error: {
        color: '#B91C1C',
    },
    actions: {
        width: '100%',
        gap: 8,
    },
});
