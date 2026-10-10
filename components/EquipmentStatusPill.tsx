import Pill from './Pill';
import type { Equipment } from '../models/Equipment';
import { EQUIPMENT_STATUS_LABELS, getEquipmentStatus, type EquipmentStatus } from '../utils/equipmentStatus';

const STATUS_VARIANTS: Record<EquipmentStatus, 'success' | 'danger'> = {
    active: 'success',
    inactive: 'danger',
};

type EquipmentStatusPillProps = {
    equipment: Equipment;
};

export default function EquipmentStatusPill({ equipment }: EquipmentStatusPillProps) {
    const status = getEquipmentStatus(equipment);
    return <Pill label={EQUIPMENT_STATUS_LABELS[status]} variant={STATUS_VARIANTS[status]} />;
}
