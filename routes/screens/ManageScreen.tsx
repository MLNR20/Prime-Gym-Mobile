import { useEffect, useState, type ComponentProps } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import SubscribersScreen from './SubscribersScreen';
import EquipmentScreen from './EquipmentScreen';
import ContactsScreen from './ContactsScreen';
import LockerKeysScreen from './LockerKeysScreen';
import ExercisesScreen from './ExercisesScreen';
import ProgramsScreen from './ProgramsScreen';
import FinanceScreen from './FinanceScreen';
import ReportsScreen from './ReportsScreen';

export type ManageSection = 'subscribers' | 'finance' | 'reports' | 'exercises' | 'programs' | 'equipment' | 'contacts' | 'lockerKeys';

const SECTIONS: { value: ManageSection; label: string; icon: ComponentProps<typeof MaterialCommunityIcons>['name'] }[] = [
    { value: 'subscribers', label: 'Subscribers', icon: 'account-group' },
    { value: 'finance', label: 'Finance', icon: 'cash-multiple' },
    { value: 'exercises', label: 'Exercises', icon: 'arm-flex-outline' },
    { value: 'programs', label: 'Programs', icon: 'clipboard-list-outline' },
    { value: 'equipment', label: 'Equipment', icon: 'dumbbell' },
    { value: 'contacts', label: 'Contacts', icon: 'card-account-phone-outline' },
    { value: 'lockerKeys', label: 'Locker Keys', icon: 'key-variant' },
    { value: 'reports', label: 'Reports', icon: 'chart-box-outline' },
];

export default function ManageScreen() {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const [section, setSection] = useState<ManageSection | null>(route.params?.section ?? null);

    useEffect(() => {
        if (route.params?.section) setSection(route.params.section);
    }, [route.params]);

    // Re-tapping the Manage tab while already on it returns to the section picker.
    useEffect(() => {
        const unsubscribe = navigation.addListener('tabPress', () => {
            if (navigation.isFocused()) setSection(null);
        });
        return unsubscribe;
    }, [navigation]);

    if (section === null) {
        return (
            <View style={styles.screen}>
                <View style={styles.hubHeader}>
                    <Text style={styles.hubTitle} className="text-[1.45rem] font-poppins-bold">Manage</Text>
                </View>
                <View style={styles.hubGrid}>
                    {SECTIONS.map((item) => (
                        <Pressable key={item.value} style={styles.hubTile} onPress={() => setSection(item.value)}>
                            <MaterialCommunityIcons name={item.icon} size={32} color="#F59E0B" />
                            <Text style={styles.hubItemTitle}>{item.label}</Text>
                        </Pressable>
                    ))}
                </View>
            </View>
        );
    }

    return (
        <View style={styles.screen}>
            {section === 'subscribers' && <SubscribersScreen onBack={() => setSection(null)} />}
            {section === 'finance' && <FinanceScreen onBack={() => setSection(null)} />}
            {section === 'reports' && <ReportsScreen onBack={() => setSection(null)} />}
            {section === 'exercises' && <ExercisesScreen onBack={() => setSection(null)} />}
            {section === 'programs' && <ProgramsScreen onBack={() => setSection(null)} />}
            {section === 'equipment' && <EquipmentScreen onBack={() => setSection(null)} />}
            {section === 'contacts' && <ContactsScreen onBack={() => setSection(null)} />}
            {section === 'lockerKeys' && <LockerKeysScreen onBack={() => setSection(null)} />}
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#fff',
    },
    hubHeader: {
        paddingHorizontal: 32,
        paddingTop: 96,
        paddingBottom: 24,
    },
    hubTitle: {
        color: '#000000',
        fontFamily: 'Poppins_700Bold',
    },
    hubGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 32,
        gap: 12,
    },
    hubTile: {
        flexBasis: '47%',
        flexGrow: 1,
        height: 120,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        backgroundColor: '#F2F5F7',
        borderWidth: 2,
        borderColor: '#EDF0F2',
        borderRadius: 12,
    },
    hubItemTitle: {
        color: '#000000',
        fontSize: 14,
        fontFamily: 'Poppins_600SemiBold',
    },
});
