import { useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';
import { Button, Menu } from 'react-native-paper';
import SubscribersScreen from './SubscribersScreen';
import EquipmentScreen from './EquipmentScreen';
import ContactsScreen from './ContactsScreen';
import LockerKeysScreen from './LockerKeysScreen';

export type ManageSection = 'subscribers' | 'equipment' | 'contacts' | 'lockerKeys';

const SECTIONS: { value: ManageSection; label: string }[] = [
    { value: 'subscribers', label: 'Subscribers' },
    { value: 'equipment', label: 'Equipment' },
    { value: 'contacts', label: 'Contacts' },
    { value: 'lockerKeys', label: 'Locker Keys' },
];

export default function ManageScreen() {
    const route = useRoute<any>();
    const [section, setSection] = useState<ManageSection>(route.params?.section ?? 'subscribers');
    const [menuVisible, setMenuVisible] = useState(false);

    useEffect(() => {
        if (route.params?.section) setSection(route.params.section);
    }, [route.params?.section]);

    const currentLabel = SECTIONS.find((item) => item.value === section)?.label ?? '';

    return (
        <View style={styles.screen}>
            <View style={styles.selectorWrapper}>
                <Menu
                    visible={menuVisible}
                    onDismiss={() => setMenuVisible(false)}
                    anchor={
                        <Button mode="outlined" icon="menu-down" onPress={() => setMenuVisible(true)}>
                            {currentLabel}
                        </Button>
                    }
                >
                    {SECTIONS.map((item) => (
                        <Menu.Item
                            key={item.value}
                            onPress={() => {
                                setSection(item.value);
                                setMenuVisible(false);
                            }}
                            title={item.label}
                        />
                    ))}
                </Menu>
            </View>
            <View style={styles.content}>
                {section === 'subscribers' && <SubscribersScreen />}
                {section === 'equipment' && <EquipmentScreen />}
                {section === 'contacts' && <ContactsScreen />}
                {section === 'lockerKeys' && <LockerKeysScreen />}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#fff',
    },
    selectorWrapper: {
        paddingHorizontal: 32,
        paddingTop: 56,
        paddingBottom: 12,
        backgroundColor: '#fff',
        alignItems: 'flex-start',
    },
    content: {
        flex: 1,
    },
});
