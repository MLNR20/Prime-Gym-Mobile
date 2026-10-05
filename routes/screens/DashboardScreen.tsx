import { ScrollView } from 'react-native';
import LabelHeader from '../../components/LabelHeader';
import WelcomeCard from '../../components/WelcomeCard';
import QuickActionsGrid from '../../components/QuickActionsGrid';
import RecentActivityCard from '../../components/RecentActivityCard';
import { dashboardScreenStyles } from '../../components/commonStyles';

export default function DashboardScreen() {
    return (
        <ScrollView style={dashboardScreenStyles.scrollView} contentContainerStyle={dashboardScreenStyles.content}>
            <LabelHeader label="Dashboard" onPress={() => {}} />
            <WelcomeCard membershipId="00123" />
            <QuickActionsGrid />
            <RecentActivityCard />
        </ScrollView>
    );
}
