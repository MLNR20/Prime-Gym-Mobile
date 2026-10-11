import { useEffect, useMemo, useState } from 'react';
import type { LockerKeyFormValues } from '../components/LockerKeyForm';
import type { LockerKey } from '../models/LockerKey';
import { auditLogRepository, lockerKeyRepository } from '../repositories/activeRepositories';
import { nowInPhilippineTime } from '../utils/dateTime';

export function useLockerKeysViewModel() {
    const [lockerKeys, setLockerKeys] = useState<LockerKey[]>([]);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingLockerKey, setEditingLockerKey] = useState<LockerKey | null>(null);

    useEffect(() => {
        const unsubscribe = lockerKeyRepository.subscribe(
            (data) => {
                setLockerKeys(data);
                setLoading(false);
            },
            (err) => {
                setError(err.message);
                setLoading(false);
            }
        );
        return unsubscribe;
    }, []);

    const filteredLockerKeys = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();
        if (!normalizedQuery) return lockerKeys;
        return lockerKeys.filter(
            (lockerKey) =>
                lockerKey.locker_number.toLowerCase().includes(normalizedQuery) ||
                lockerKey.key_code.toLowerCase().includes(normalizedQuery) ||
                lockerKey.assigned_to.toLowerCase().includes(normalizedQuery)
        );
    }, [lockerKeys, query]);

    const removeLockerKey = (id: string) => lockerKeyRepository.remove(id);

    const startEditing = (lockerKey: LockerKey) => setEditingLockerKey(lockerKey);
    const cancelEditing = () => setEditingLockerKey(null);

    const submitLockerKey = async (values: LockerKeyFormValues) => {
        const timestamp = nowInPhilippineTime();
        if (editingLockerKey) {
            await lockerKeyRepository.update(editingLockerKey.id, { ...values, date_updated: timestamp });
            setEditingLockerKey(null);
        } else {
            await lockerKeyRepository.add({
                ...values,
                date_created: timestamp,
                date_updated: timestamp,
            });
            await auditLogRepository.add({
                reference: `Locker ${values.locker_number}`,
                action: 'Added new locker key',
                date_created: timestamp,
                date_updated: timestamp,
            });
        }
    };

    return {
        lockerKeys: filteredLockerKeys,
        query,
        setQuery,
        loading,
        error,
        editingLockerKey,
        startEditing,
        cancelEditing,
        submitLockerKey,
        removeLockerKey,
    };
}
