import { useEffect, useMemo, useState } from 'react';
import type { EquipmentFormValues } from '../components/EquipmentForm';
import type { Equipment } from '../models/Equipment';
import { equipmentRepository } from '../repositories/activeRepositories';
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

    const removeEquipment = (id: string) => equipmentRepository.remove(id);

    const startEditing = (item: Equipment) => setEditingEquipment(item);
    const cancelEditing = () => setEditingEquipment(null);

    const submitEquipment = async (values: EquipmentFormValues) => {
        const timestamp = nowInPhilippineTime();
        if (editingEquipment) {
            await equipmentRepository.update(editingEquipment.id, { ...values, date_updated: timestamp });
            setEditingEquipment(null);
        } else {
            await equipmentRepository.add({
                ...values,
                date_created: timestamp,
                date_updated: timestamp,
            });
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
