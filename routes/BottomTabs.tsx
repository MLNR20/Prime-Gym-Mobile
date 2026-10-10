import type { ComponentProps } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import DashboardScreen from './screens/DashboardScreen';
import AttendanceScreen from './screens/AttendanceScreen';
import SubscribersScreen from './screens/SubscribersScreen';
import EquipmentScreen from './screens/EquipmentScreen';
import ContactsScreen from './screens/ContactsScreen';
import LockerKeysScreen from './screens/LockerKeysScreen';
import ProfileScreen from './screens/ProfileScreen';
import SettingsScreen from './screens/SettingsScreen';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

const ICONS: Record<string, IconName> = {
    Dashboard: 'view-dashboard',
    Attendance: 'calendar-check',
    Subscribers: 'account-group',
    Equipment: 'dumbbell',
    Contacts: 'card-account-phone-outline',
    LockerKeys: 'key-variant',
    Profile: 'account',
    Settings: 'cog',
};

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name={ICONS[route.name]} color={color} size={size} />
                ),
            })}
        >
            <Tab.Screen name="Dashboard" component={DashboardScreen} />
            <Tab.Screen name="Attendance" component={AttendanceScreen} />
            <Tab.Screen name="Subscribers" component={SubscribersScreen} />
            <Tab.Screen name="Equipment" component={EquipmentScreen} />
            <Tab.Screen name="Contacts" component={ContactsScreen} />
            <Tab.Screen name="LockerKeys" component={LockerKeysScreen} options={{ title: 'Locker Keys' }} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
    );
}
