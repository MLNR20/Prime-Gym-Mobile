import { ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LabelHeader from '../../components/LabelHeader';
import WelcomeCard from '../../components/WelcomeCard';
import QuickActionsGrid from '../../components/QuickActionsGrid';
import RecentActivityCard from '../../components/RecentActivityCard';
import { dashboardScreenStyles } from '../../components/commonStyles';

export default function DashboardScreen() {
    const navigation = useNavigation();

    const handleQuickAction = (key: string) => {
        if (key === 'members') {
            navigation.navigate('Subscribers' as never);
        }
        if (key === 'equipment') {
            navigation.navigate('Equipment' as never);
        }
        if (key === 'contacts') {
            navigation.navigate('Contacts' as never);
        }
        if (key === 'lockers') {
            navigation.navigate('LockerKeys' as never);
        }
    };

    return (
        <ScrollView style={dashboardScreenStyles.scrollView} contentContainerStyle={dashboardScreenStyles.content}>
            <LabelHeader label="Dashboard" onPress={() => {}} />
            <WelcomeCard membershipId="00123" />
            <QuickActionsGrid onPress={handleQuickAction} />
            <RecentActivityCard />
        </ScrollView>
    );
}
