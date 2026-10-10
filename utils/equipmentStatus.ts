import type { Equipment } from '../models/Equipment';

export type EquipmentStatus = 'active' | 'inactive';

export const EQUIPMENT_STATUS_LABELS: Record<EquipmentStatus, string> = {
    active: 'Active',
    inactive: 'Inactive',
};

export function getEquipmentStatus(equipment: Equipment): EquipmentStatus {
    return equipment.is_active ? 'active' : 'inactive';
}
