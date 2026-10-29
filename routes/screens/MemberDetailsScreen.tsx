import DetailSection from '../../components/DetailSection';
import DetailsHeader from '../../components/DetailsHeader';
import DetailsScreenLayout from '../../components/DetailsScreenLayout';
import MemberStatusPill from '../../components/MemberStatusPill';
import type { Member } from '../../models/Member';
import { formatPeso } from '../../utils/currency';
import { formatDateOnly, formatPhilippineDate, formatPhilippineTimestamp } from '../../utils/dateTime';
import { useMemberAttendanceViewModel } from '../../viewmodels/useMemberAttendanceViewModel';

type MemberDetailsScreenProps = {
    member: Member;
    onBack: () => void;
    onEdit: () => void;
    onDelete: () => void;
};

export default function MemberDetailsScreen({ member, onBack, onEdit, onDelete }: MemberDetailsScreenProps) {
    const attendance = useMemberAttendanceViewModel(member.id);
    const hasVisits = attendance.visitCount > 0;

    return (
        <DetailsScreenLayout onBack={onBack} onEdit={onEdit} footerText="Manage your subscribers right here">
            <DetailSection
                header={
                    <DetailsHeader title={`${member.first_name} ${member.last_name}`} onDelete={onDelete} deleteLabel="Delete subscriber">
                        <MemberStatusPill member={member} />
                    </DetailsHeader>
                }
                title="Personal Information"
                description="Personal and subscription details for this subscriber."
                rows={[
                    { label: 'Membership ID', value: member.id },
                    { label: 'Plan', value: member.plan },
                    { label: 'Payment Date', value: formatDateOnly(member.payment_date) },
                    { label: 'Payment Amount', value: formatPeso(member.payment_amount ?? 0) },
                    { label: 'Subscription Expiration', value: formatDateOnly(member.subscription_expiration_date) },
                    { label: 'Date Created', value: formatPhilippineDate(member.date_created) },
                    { label: 'Date Updated', value: formatPhilippineDate(member.date_updated) },
                ]}
            />
            <DetailSection
                title="Attendance"
                description="Check-in history and visit activity for this subscriber."
                rows={[
                    { label: 'Visits', value: String(attendance.visitCount) },
                    { label: 'Last Visit', value: hasVisits ? formatPhilippineTimestamp(attendance.lastTimeIn) : '—' },
                    { label: 'Status', value: hasVisits ? (attendance.checkedIn ? 'Checked in' : 'Checked out') : '—' },
                ]}
            />
        </DetailsScreenLayout>
    );
}
