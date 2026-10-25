import { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';
import { List, Text } from 'react-native-paper';
import SubscribersScreen from './SubscribersScreen';
import EquipmentScreen from './EquipmentScreen';
import ContactsScreen from './ContactsScreen';
import LockerKeysScreen from './LockerKeysScreen';
import { commonStyles } from '../../components/commonStyles';

export type ManageSection = 'subscribers' | 'equipment' | 'contacts' | 'lockerKeys';

const SECTIONS: { value: ManageSection; label: string; icon: string }[] = [
    { value: 'subscribers', label: 'Subscribers', icon: 'account-group' },
    { value: 'equipment', label: 'Equipment', icon: 'dumbbell' },
    { value: 'contacts', label: 'Contacts', icon: 'card-account-phone-outline' },
    { value: 'lockerKeys', label: 'Locker Keys', icon: 'key-variant' },
];

export default function ManageScreen() {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const [section, setSection] = useState<ManageSection | null>(route.params?.section ?? null);

    useEffect(() => {
        if (route.params?.section) setSection(route.params.section);
    }, [route.params?.section]);

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
                    <Text className="text-[1.45rem] font-poppins-bold">Manage</Text>
                </View>
                <View style={styles.hubList}>
                    {SECTIONS.map((item) => (
                        <List.Item
                            key={item.value}
                            title={item.label}
                            left={(props) => <List.Icon {...props} icon={item.icon} />}
                            right={(props) => <List.Icon {...props} icon="chevron-right" />}
                            onPress={() => setSection(item.value)}
                            titleStyle={styles.hubItemTitle}
                            style={commonStyles.cardForListView}
                        />
                    ))}
                </View>
            </View>
        );
    }

    return (
        <View style={styles.screen}>
            {section === 'subscribers' && <SubscribersScreen onBack={() => setSection(null)} />}
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
        paddingTop: 64,
        paddingBottom: 24,
    },
    hubList: {
        paddingHorizontal: 32,
        gap: 12,
    },
    hubItemTitle: {
        color: '#3F2D00',
        fontWeight: 'bold',
    },
});
