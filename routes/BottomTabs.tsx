import type { ComponentProps } from 'react';
import { StyleSheet, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';

import DashboardScreen from './screens/DashboardScreen';
import ManageScreen from './screens/ManageScreen';
import ProfileScreen from './screens/ProfileScreen';
import SettingsScreen from './screens/SettingsScreen';

type IconName = ComponentProps<typeof Ionicons>['name'];

const ICONS: Record<string, IconName> = {
    Dashboard: 'grid-outline',
    Manage: 'briefcase-outline',
    Profile: 'person-outline',
    Settings: 'settings-outline',
};

// Same sizing and styling as the Services grid icons.
const ICON_WRAPPER_SIZE = 56 - 0.1 * 16;
const ICON_SIZE = 56 * 0.6 - 0.1 * 16;

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: '#F59E0B',
                tabBarInactiveTintColor: '#9CA3AF',
                tabBarStyle: { height: 88, paddingTop: 8, paddingBottom: 2, marginBottom: 2 },
                tabBarLabelStyle: { fontFamily: 'Poppins_600SemiBold', fontSize: 10 + 0.01 * 16, marginTop: 0.4 * 16, marginBottom: 0.2 * 16 },
                tabBarIcon: ({ color }) => (
                    <View style={styles.iconWrapper}>
                        <Ionicons name={ICONS[route.name]} color={color} size={ICON_SIZE} style={styles.icon} />
                    </View>
                ),
            })}
        >
            <Tab.Screen name="Dashboard" component={DashboardScreen} />
            <Tab.Screen name="Manage" component={ManageScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    iconWrapper: {
        width: ICON_WRAPPER_SIZE,
        height: ICON_WRAPPER_SIZE,
        marginTop: 0.01 * 16,
        marginBottom: 0.2 * 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        textAlign: 'center',
        textAlignVertical: 'center',
        includeFontPadding: false,
    },
});
