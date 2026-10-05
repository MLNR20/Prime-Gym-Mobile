import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import AddMemberScreen from './AddMemberScreen';
import AttendanceHeader from '../../components/AttendanceHeader';
import type { MemberFormValues } from '../../components/MemberForm';
import MemberListCard from '../../components/MemberListCard';
import { commonStyles } from '../../components/commonStyles';
import { useAttendanceViewModel } from '../../viewmodels/useAttendanceViewModel';

export default function AttendanceScreen() {
    const { members, query, setQuery, presentMemberIds, toggleAttendance, addMember, loading, error } =
        useAttendanceViewModel();
    const [isAdding, setIsAdding] = useState(false);

    const handleSubmit = async (values: MemberFormValues) => {
        await addMember(values);
        setIsAdding(false);
    };

    if (isAdding) {
        return (
            <AddMemberScreen editingMember={null} onSubmit={handleSubmit} onCancel={() => setIsAdding(false)} />
        );
    }

    return (
        <View style={[commonStyles.scrollView, commonStyles.container]}>
            <AttendanceHeader onAddPress={() => setIsAdding(true)} />
            <MemberListCard
                members={members}
                query={query}
                onQueryChange={setQuery}
                loading={loading}
                error={error}
                onItemPress={(member) => toggleAttendance(member.id)}
                renderRight={(member) => (
                    <IconButton
                        icon={presentMemberIds.has(member.id) ? 'check-circle' : 'circle-outline'}
                        iconColor={presentMemberIds.has(member.id) ? '#166534' : '#5C4300'}
                        onPress={() => toggleAttendance(member.id)}
                    />
                )}
            />
        </View>
    );
}
