import { ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LabelHeader from '../../components/LabelHeader';
import WelcomeCard from '../../components/WelcomeCard';
import QuickActionsGrid from '../../components/QuickActionsGrid';
import RecentActivityCard from '../../components/RecentActivityCard';
import { dashboardScreenStyles } from '../../components/commonStyles';

export default function DashboardScreen() {
    const navigation = useNavigation();

    const navigateToManage = (section: string) => (navigation.navigate as (name: string, params: object) => void)('Manage', { section });

    const handleQuickAction = (key: string) => {
        if (key === 'members') {
            navigateToManage('subscribers');
        }
        if (key === 'equipment') {
            navigateToManage('equipment');
        }
        if (key === 'contacts') {
            navigateToManage('contacts');
        }
        if (key === 'lockers') {
            navigateToManage('lockerKeys');
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
