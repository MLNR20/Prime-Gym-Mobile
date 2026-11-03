import { useState, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Switch } from 'react-native-paper';
import { dashboardScreenStyles, surfaceBorder } from '../../components/commonStyles';
import { rem } from '../../utils/rem';
import { requestDeviceAlertPermission } from '../../utils/deviceAlerts';
import { useNotificationSettings } from '../../utils/notificationSettings';
import { usePlanNames } from '../../viewmodels/usePlansViewModel';
import ExportDataScreen from './ExportDataScreen';
import GymProfileScreen from './GymProfileScreen';
import PlansScreen from './PlansScreen';
import { palette, themedStyles, useAppTheme } from '../../utils/theme';

// The three Notifications toggles and Dark Mode are wired up and saved; Cloud Backup holds local state for now. Gym Profile, Membership Plans and Export Data open real screens.

type IconName = keyof typeof Ionicons.glyphMap;

type SettingsRowProps = {
    icon: IconName;
    label: string;
    description: string;
    isLast?: boolean;
    /** Right side of the row: a Switch, a value, or a chevron. */
    trailing: ReactNode;
    onPress?: () => void;
};

function SettingsRow({ icon, label, description, isLast, trailing, onPress }: SettingsRowProps) {
    // Row layout sits on a plain View inside the Pressable (a Pressable style function lost flexDirection on iOS).
    return (
        <Pressable disabled={!onPress} onPress={onPress}>
            {({ pressed }) => (
                <View style={[styles.row, !isLast && styles.rowDivider, pressed && styles.rowPressed]}>
                    <View style={styles.iconWrapper}>
                        <Ionicons name={icon} size={18} color="#FBBF77" />
                    </View>
                    <View style={styles.textGroup}>
                        <Text style={styles.label} numberOfLines={1}>{label}</Text>
                        <Text style={styles.description} numberOfLines={1}>{description}</Text>
                    </View>
                    {trailing}
                </View>
            )}
        </Pressable>
    );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <View style={styles.sectionCard}>{children}</View>
        </View>
    );
}

const Chevron = () => <Ionicons name="chevron-forward" size={18} color={palette.subtle} />;
const Value = ({ children }: { children: string }) => <Text style={styles.value}>{children}</Text>;

export default function SettingsScreen() {
    const [view, setView] = useState<'settings' | 'gym' | 'plans' | 'export'>('settings');
    const planNames = usePlanNames();
    const { settings, update } = useNotificationSettings();
    const [pushDenied, setPushDenied] = useState(false);
    const [cloudBackup, setCloudBackup] = useState(true);
    // Dark mode is the one toggle that is real: it is saved and restyles the whole app.
    const { isDark, setScheme } = useAppTheme();

    const toggle = (value: boolean, onValueChange: (next: boolean) => void) => (
        <Switch value={value} onValueChange={onValueChange} color="#F59E0B" />
    );

    // Turning push on asks the device for permission first; if it is refused the switch stays off.
    const setPush = async (next: boolean) => {
        if (next && !(await requestDeviceAlertPermission())) {
            setPushDenied(true);
            return;
        }
        setPushDenied(false);
        await update({ push: next });
    };

    const showSettings = () => setView('settings');
    if (view === 'gym') return <GymProfileScreen onBack={showSettings} />;
    if (view === 'plans') return <PlansScreen onBack={showSettings} />;
    if (view === 'export') return <ExportDataScreen onBack={showSettings} />;

    return (
        <ScrollView style={dashboardScreenStyles.scrollView} contentContainerStyle={dashboardScreenStyles.content}>
            <Text style={styles.title}>Settings</Text>

            <Section title="Notifications">
                <SettingsRow icon="notifications-outline" label="Push Notifications" description={pushDenied ? 'Allow notifications in device settings' : 'Alerts on this device'} trailing={toggle(settings.push, setPush)} />
                <SettingsRow icon="time-outline" label="Expiring Subscriptions" description="Remind 7 days before" trailing={toggle(settings.expiry, (next) => update({ expiry: next }))} />
                <SettingsRow icon="mail-open-outline" label="Daily Summary" description="Check-ins and earnings" trailing={toggle(settings.daily, (next) => update({ daily: next }))} isLast />
            </Section>

            <Section title="Gym">
                <SettingsRow icon="business-outline" label="Gym Profile" description="Name and contact details" trailing={<Chevron />} onPress={() => setView('gym')} />
                <SettingsRow icon="pricetags-outline" label="Membership Plans" description={planNames.join(', ') || 'Add your plans'} trailing={<Chevron />} onPress={() => setView('plans')} />
                <SettingsRow icon="card-outline" label="Payment Methods" description="Cash, GCash and bank" trailing={<Chevron />} onPress={() => {}} isLast />
            </Section>

            <Section title="Data">
                <SettingsRow icon="cloud-upload-outline" label="Cloud Backup" description="Back up to Firestore" trailing={toggle(cloudBackup, setCloudBackup)} />
                <SettingsRow icon="download-outline" label="Export Data" description="Subscribers and payments" trailing={<Chevron />} onPress={() => setView('export')} isLast />
            </Section>

            <Section title="Appearance">
                <SettingsRow icon="moon-outline" label="Dark Mode" description="Darker color scheme" trailing={toggle(isDark, (next) => setScheme(next ? 'dark' : 'light'))} />
                <SettingsRow icon="language-outline" label="Language" description="Display language" trailing={<Value>English</Value>} onPress={() => {}} isLast />
            </Section>

            <Section title="About">
                <SettingsRow icon="information-circle-outline" label="Version" description="Prime Gym" trailing={<Value>1.0.0</Value>} />
                <SettingsRow icon="shield-checkmark-outline" label="Terms & Privacy" description="How your data is used" trailing={<Chevron />} onPress={() => {}} isLast />
            </Section>
        </ScrollView>
    );
}

const styles = themedStyles(() => StyleSheet.create({
    title: {
        color: palette.text,
        fontSize: rem(1.45),
        fontFamily: 'Poppins_700Bold',
    },
    section: {
        width: '100%',
        marginTop: 24,
        gap: 12,
    },
    sectionTitle: {
        color: palette.text,
        fontSize: rem(1.125),
        fontFamily: 'Poppins_700Bold',
    },
    sectionCard: {
        width: '100%',
        backgroundColor: palette.background,
        paddingVertical: 6,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
        paddingVertical: 12,
    },
    rowDivider: {
        borderBottomWidth: 1,
        borderBottomColor: palette.surface,
    },
    rowPressed: {
        opacity: 0.7,
    },
    iconWrapper: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: palette.surface,
        ...surfaceBorder,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textGroup: {
        flex: 1,
        gap: 2,
    },
    label: {
        color: palette.text,
        fontSize: rem(0.975),
        fontFamily: 'Poppins_700Bold',
    },
    description: {
        color: palette.muted,
        fontSize: rem(0.95),
        fontFamily: 'Poppins_400Regular',
    },
    value: {
        color: palette.muted,
        fontSize: rem(0.875),
        fontFamily: 'Poppins_500Medium',
    },
}));
