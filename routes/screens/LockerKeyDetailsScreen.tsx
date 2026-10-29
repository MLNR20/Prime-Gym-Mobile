import DetailSection from '../../components/DetailSection';
import DetailsHeader from '../../components/DetailsHeader';
import DetailsScreenLayout from '../../components/DetailsScreenLayout';
import LockerKeyStatusPill from '../../components/LockerKeyStatusPill';
import type { LockerKey } from '../../models/LockerKey';
import { formatPhilippineTimestamp } from '../../utils/dateTime';

type LockerKeyDetailsScreenProps = {
    lockerKey: LockerKey;
    onBack: () => void;
    onEdit: () => void;
    onDelete: () => void;
};

export default function LockerKeyDetailsScreen({ lockerKey, onBack, onEdit, onDelete }: LockerKeyDetailsScreenProps) {
    return (
        <DetailsScreenLayout onBack={onBack} onEdit={onEdit} footerText="Manage your locker keys right here">
            <DetailSection
                header={
                    <DetailsHeader title={`Locker ${lockerKey.locker_number}`} subtitle={lockerKey.key_code} onDelete={onDelete} deleteLabel="Delete locker key">
                        <LockerKeyStatusPill lockerKey={lockerKey} />
                    </DetailsHeader>
                }
                title="Locker Information"
                description="Key and assignment details for this locker."
                rows={[
                    { label: 'Assigned To', value: lockerKey.assigned_to || '—', fullWidth: true },
                    { label: 'Date Created', value: formatPhilippineTimestamp(lockerKey.date_created) },
                    { label: 'Date Updated', value: formatPhilippineTimestamp(lockerKey.date_updated) },
                ]}
            />
        </DetailsScreenLayout>
    );
}
