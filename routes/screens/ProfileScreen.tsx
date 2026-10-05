import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Button } from 'react-native-paper';
import LabelHeader from '../../components/LabelHeader';
import { dashboardScreenStyles } from '../../components/commonStyles';

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
                <Text style={styles.infoLabel}>{label}</Text>
                <Text style={styles.infoValue}>{value}</Text>
            </View>
        </View>
    );
}

type ActionRowProps = {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    isLast?: boolean;
    danger?: boolean;
    onPress?: () => void;
};

function ActionRow({ icon, label, isLast, danger, onPress }: ActionRowProps) {
    return (
        <Pressable
            style={({ pressed }) => [
                styles.actionRow,
                !isLast && styles.infoRowDivider,
                pressed && styles.actionRowPressed,
            ]}
            onPress={onPress}
        >
            <View style={styles.iconWrapper}>
                <Ionicons name={icon} size={18} color={danger ? '#DC2626' : '#FBBF77'} />
            </View>
            <Text style={[styles.actionLabel, danger && styles.actionLabelDanger]}>{label}</Text>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
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
                    <Text className="text-xl font-poppins-bold text-black">{OWNER.name}</Text>
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
                    <ActionRow icon="create-outline" label="Edit Profile" />
                    <ActionRow icon="lock-closed-outline" label="Change Password" />
                    <ActionRow icon="log-out-outline" label="Log Out" danger isLast />
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
        gap: 2,
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
        padding: 16,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 10,
    },
    infoRowDivider: {
        borderBottomWidth: 1,
        borderBottomColor: '#F2F5F7',
    },
    iconWrapper: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#F2F5F7',
        alignItems: 'center',
        justifyContent: 'center',
    },
    infoTextGroup: {
        flex: 1,
        gap: 2,
    },
    infoLabel: {
        fontSize: 12,
        color: '#6B7280',
    },
    infoValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000000',
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 12,
    },
    actionRowPressed: {
        opacity: 0.7,
    },
    actionLabel: {
        flex: 1,
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000000',
    },
    actionLabelDanger: {
        color: '#DC2626',
    },
});
