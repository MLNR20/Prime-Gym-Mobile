import DetailSection from '../../components/DetailSection';
import DetailsHeader from '../../components/DetailsHeader';
import DetailsScreenLayout from '../../components/DetailsScreenLayout';
import EquipmentStatusPill from '../../components/EquipmentStatusPill';
import type { Equipment } from '../../models/Equipment';
import { formatPhilippineDate } from '../../utils/dateTime';

type EquipmentDetailsScreenProps = {
    equipment: Equipment;
    onBack: () => void;
    onEdit: () => void;
    onDelete: () => void;
};

export default function EquipmentDetailsScreen({ equipment, onBack, onEdit, onDelete }: EquipmentDetailsScreenProps) {
    return (
        <DetailsScreenLayout onBack={onBack} onEdit={onEdit} footerText="Manage your gym equipment right here">
            <DetailSection
                header={
                    <DetailsHeader title={equipment.title} onDelete={onDelete} deleteLabel="Delete equipment">
                        <EquipmentStatusPill equipment={equipment} />
                    </DetailsHeader>
                }
                title="Equipment Information"
                description="Identification and history for this piece of equipment."
                rows={[
                    { label: 'Equipment ID', value: equipment.id, fullWidth: true },
                    { label: 'Date Created', value: formatPhilippineDate(equipment.date_created) },
                    { label: 'Date Updated', value: formatPhilippineDate(equipment.date_updated) },
                ]}
            />
        </DetailsScreenLayout>
    );
}
