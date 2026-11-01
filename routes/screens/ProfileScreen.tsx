import { useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Button } from 'react-native-paper';
import LabelHeader from '../../components/LabelHeader';
import { dashboardScreenStyles, surfaceBorder } from '../../components/commonStyles';
import { useGymProfile } from '../../utils/gymProfile';
import { rem } from '../../utils/rem';
import { auth } from '../../firebase/firebaseConfig';
import { signOutUser } from '../../viewmodels/useAuthViewModel';
import ChangePasswordScreen from './ChangePasswordScreen';
import EditProfileScreen from './EditProfileScreen';
import { palette, themedStyles } from '../../utils/theme';

const OWNER = {
    name: 'Miguel Rivadenera',
    role: 'Prime-Gym Owner',
    email: 'owner@primegym.ph',
    phone: '+63 917 000 0000',
    gymName: 'Prime Gym',
    memberSince: 'January 2023',
};

function getInitials(fullName: string) {
    return fullName
        .split(' ')
        .filter(Boolean)
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
}

type InfoRowProps = {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    value: string;
    isLast?: boolean;
};

function InfoRow({ icon, label, value, isLast }: InfoRowProps) {
    return (
        <View style={[styles.infoRow, !isLast && styles.infoRowDivider]}>
            <View style={styles.iconWrapper}>
                <Ionicons name={icon} size={18} color="#FBBF77" />
            </View>
            <View style={styles.infoTextGroup}>
                <Text style={styles.infoValue}>{value}</Text>
                <Text style={styles.infoLabel}>{label}</Text>
            </View>
        </View>
    );
}

type ActionRowProps = {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    description: string;
    isLast?: boolean;
    danger?: boolean;
    onPress?: () => void;
};

function ActionRow({ icon, label, description, isLast, danger, onPress }: ActionRowProps) {
    // The row layout lives on a plain View inside the Pressable: a style function on the Pressable itself
    // dropped flexDirection on iOS and stacked the icon, text and chevron vertically.
    return (
        <Pressable onPress={onPress}>
            {({ pressed }) => (
                <View style={[styles.actionRow, !isLast && styles.infoRowDivider, pressed && styles.actionRowPressed]}>
                    <View style={styles.iconWrapper}>
                        <Ionicons name={icon} size={18} color={danger ? palette.danger : '#FBBF77'} />
                    </View>
                    <View style={styles.infoTextGroup}>
                        <Text style={[styles.actionLabel, danger && styles.actionLabelDanger]} numberOfLines={1}>{label}</Text>
                        <Text style={styles.infoLabel} numberOfLines={1}>{description}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color={palette.subtle} />
                </View>
            )}
        </Pressable>
    );
}

export default function ProfileScreen() {
    const [view, setView] = useState<'profile' | 'edit' | 'password'>('profile');
    // updateProfile doesn't fire the auth listener, so the saved name is kept here to refresh the card.
    const [name, setName] = useState(auth.currentUser?.displayName || OWNER.name);
    const email = auth.currentUser?.email || OWNER.email;
    // Reloaded each time the tab regains focus, so edits made in Settings > Gym Profile show up here.
    const gym = useGymProfile(useIsFocused());

    if (view === 'edit') {
        return <EditProfileScreen initialName={name} email={email} onSaved={setName} onBack={() => setView('profile')} />;
    }
    if (view === 'password') {
        return <ChangePasswordScreen onBack={() => setView('profile')} />;
    }

    return (
        <ScrollView style={dashboardScreenStyles.scrollView} contentContainerStyle={dashboardScreenStyles.content}>
            <LabelHeader label="Profile" icon="pencil-outline" onPress={() => setView('edit')} />

            <LinearGradient
                colors={['#F59E0B', '#FFC107']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.card}
            >
                <View style={styles.avatar}>
                    <Text className="text-xl font-poppins-bold text-black">{getInitials(name)}</Text>
                </View>
                <View style={styles.identity}>
                    <Text style={styles.name} className="font-poppins-bold text-black">{name}</Text>
                    <Text className="text-sm font-poppins" style={styles.role}>
                        {OWNER.role}
                    </Text>
                </View>
            </LinearGradient>

            <View style={styles.section}>
                <Text className="text-lg font-poppins-bold" style={{ color: palette.text }}>Gym Information</Text>
                <View style={styles.sectionCard}>
                    <InfoRow icon="business-outline" label="Gym Name" value={gym.name || OWNER.gymName} />
                    <InfoRow icon="mail-outline" label="Email" value={email} />
                    <InfoRow icon="call-outline" label="Phone" value={gym.phone || 'Not set'} />
                    {!!gym.address && <InfoRow icon="location-outline" label="Address" value={gym.address} />}
                    <InfoRow icon="calendar-outline" label="Member Since" value={OWNER.memberSince} isLast />
                </View>
            </View>

            <View style={styles.section}>
                <Text className="text-lg font-poppins-bold" style={{ color: palette.text }}>Account</Text>
                <View style={styles.sectionCard}>
                    <ActionRow icon="create-outline" label="Edit Profile" description="Update your details" onPress={() => setView('edit')} />
                    <ActionRow icon="lock-closed-outline" label="Change Password" description="Keep your account secure" onPress={() => setView('password')} />
                    <ActionRow icon="log-out-outline" label="Log Out" description="Sign out of this device" danger isLast onPress={signOutUser} />
                </View>
            </View>
        </ScrollView>
    );
}

const styles = themedStyles(() => StyleSheet.create({
    card: {
        width: '100%',
        marginTop: 12,
        borderRadius: 16,
        padding: 24,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    identity: {
        flexShrink: 1,
        gap: 2,
    },
    name: {
        fontSize: rem(1.35),
        fontFamily: 'Poppins_700Bold',
        color: '#000000',
    },
    role: {
        color: '#5a3f00',
    },
    section: {
        width: '100%',
        marginTop: 24,
        gap: 12,
    },
    sectionCard: {
        width: '100%',
        backgroundColor: palette.background,
        borderRadius: 16,
        paddingHorizontal: 0,
        paddingVertical: 6,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
        paddingVertical: 12,
    },
    infoRowDivider: {
        borderBottomWidth: 1,
        borderBottomColor: palette.surface,
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
    infoTextGroup: {
        flex: 1,
        gap: 2,
    },
    infoLabel: {
        fontSize: rem(0.95),
        color: palette.muted,
        fontFamily: 'Poppins_400Regular',
    },
    infoValue: {
        fontSize: rem(0.975),
        color: palette.text,
        fontFamily: 'Poppins_700Bold',
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
        paddingVertical: 12,
    },
    actionRowPressed: {
        opacity: 0.7,
    },
    actionLabel: {
        fontSize: rem(0.975),
        color: palette.text,
        fontFamily: 'Poppins_700Bold',
    },
    actionLabelDanger: {
        color: palette.danger,
    },
}));
