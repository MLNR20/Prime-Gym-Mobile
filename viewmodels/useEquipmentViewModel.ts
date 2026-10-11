import { useEffect, useMemo, useState } from 'react';
import type { EquipmentFormValues } from '../components/EquipmentForm';
import type { Equipment } from '../models/Equipment';
import { equipmentRepository } from '../repositories/activeRepositories';
import { logAudit } from '../utils/auditLog';
import { nowInPhilippineTime } from '../utils/dateTime';

export function useEquipmentViewModel() {
    const [equipment, setEquipment] = useState<Equipment[]>([]);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);

    useEffect(() => {
        const unsubscribe = equipmentRepository.subscribe(
            (data) => {
                setEquipment(data);
                setLoading(false);
            },
            (err) => {
                setError(err.message);
                setLoading(false);
            }
        );
        return unsubscribe;
    }, []);

    const filteredEquipment = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();
        if (!normalizedQuery) return equipment;
        return equipment.filter((item) => item.title.toLowerCase().includes(normalizedQuery));
    }, [equipment, query]);

    const removeEquipment = async (item: Equipment) => {
        await equipmentRepository.remove(item.id);
        await logAudit(item.title, 'Removed equipment');
    };

    const startEditing = (item: Equipment) => setEditingEquipment(item);
    const cancelEditing = () => setEditingEquipment(null);

    const submitEquipment = async (values: EquipmentFormValues) => {
        const timestamp = nowInPhilippineTime();
        if (editingEquipment) {
            await equipmentRepository.update(editingEquipment.id, { ...values, date_updated: timestamp });
            await logAudit(values.title, 'Updated equipment');
            setEditingEquipment(null);
        } else {
            await equipmentRepository.add({
                ...values,
                date_created: timestamp,
                date_updated: timestamp,
            });
            await logAudit(values.title, 'Added new equipment');
        }
    };

    return {
        equipment: filteredEquipment,
        query,
        setQuery,
        loading,
        error,
        editingEquipment,
        startEditing,
        cancelEditing,
        submitEquipment,
        removeEquipment,
    };
}
