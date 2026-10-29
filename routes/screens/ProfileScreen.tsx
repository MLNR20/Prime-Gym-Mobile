import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Button } from 'react-native-paper';
import LabelHeader from '../../components/LabelHeader';
import { dashboardScreenStyles, surfaceBorder } from '../../components/commonStyles';
import { rem } from '../../utils/rem';

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
                        <Ionicons name={icon} size={18} color={danger ? '#DC2626' : '#FBBF77'} />
                    </View>
                    <View style={styles.infoTextGroup}>
                        <Text style={[styles.actionLabel, danger && styles.actionLabelDanger]} numberOfLines={1}>{label}</Text>
                        <Text style={styles.infoLabel} numberOfLines={1}>{description}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                </View>
            )}
        </Pressable>
    );
}

export default function ProfileScreen() {
    return (
        <ScrollView style={dashboardScreenStyles.scrollView} contentContainerStyle={dashboardScreenStyles.content}>
            <LabelHeader label="Profile" icon="pencil-outline" onPress={() => {}} />

            <LinearGradient
                colors={['#F59E0B', '#FFC107']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.card}
            >
                <View style={styles.avatar}>
                    <Text className="text-xl font-poppins-bold text-black">{getInitials(OWNER.name)}</Text>
                </View>
                <View style={styles.identity}>
                    <Text style={styles.name} className="font-poppins-bold text-black">{OWNER.name}</Text>
                    <Text className="text-sm font-poppins" style={styles.role}>
                        {OWNER.role}
                    </Text>
                </View>
            </LinearGradient>

            <View style={styles.section}>
                <Text className="text-lg font-poppins-bold text-black">Gym Information</Text>
                <View style={styles.sectionCard}>
                    <InfoRow icon="business-outline" label="Gym Name" value={OWNER.gymName} />
                    <InfoRow icon="mail-outline" label="Email" value={OWNER.email} />
                    <InfoRow icon="call-outline" label="Phone" value={OWNER.phone} />
                    <InfoRow icon="calendar-outline" label="Member Since" value={OWNER.memberSince} isLast />
                </View>
            </View>

            <View style={styles.section}>
                <Text className="text-lg font-poppins-bold text-black">Account</Text>
                <View style={styles.sectionCard}>
                    <ActionRow icon="create-outline" label="Edit Profile" description="Update your details" />
                    <ActionRow icon="lock-closed-outline" label="Change Password" description="Keep your account secure" />
                    <ActionRow icon="log-out-outline" label="Log Out" description="Sign out of this device" danger isLast />
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
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
        backgroundColor: '#FFFFFF',
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
        borderBottomColor: '#F2F5F7',
    },
    iconWrapper: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#F2F5F7',
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
        color: '#6B7280',
        fontFamily: 'Poppins_400Regular',
    },
    infoValue: {
        fontSize: rem(0.975),
        color: '#000000',
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
        color: '#000000',
        fontFamily: 'Poppins_700Bold',
    },
    actionLabelDanger: {
        color: '#DC2626',
    },
});
