import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Divider, IconButton, Text } from 'react-native-paper';
import MemberStatusPill from '../../components/MemberStatusPill';
import type { Member } from '../../models/Member';
import { formatDateOnly, formatPhilippineTimestamp } from '../../utils/dateTime';

type MemberDetailsScreenProps = {
    member: Member;
    onBack: () => void;
    onEdit: () => void;
    onDelete: () => void;
};

type DetailRowProps = {
    label: string;
    value: string;
};

function DetailRow({ label, value }: DetailRowProps) {
    return (
        <View style={styles.row}>
            <Text style={styles.rowLabel}>{label}</Text>
            <Text style={styles.rowValue}>{value}</Text>
        </View>
    );
}

type DetailTableProps = {
    rows: DetailRowProps[];
};

function DetailTable({ rows }: DetailTableProps) {
    return (
        <View style={styles.table}>
            {rows.map((row, index) => (
                <View key={row.label}>
                    <DetailRow {...row} />
                    {index < rows.length - 1 && <Divider style={styles.tableDivider} />}
                </View>
            ))}
        </View>
    );
}

export default function MemberDetailsScreen({ member, onBack, onEdit, onDelete }: MemberDetailsScreenProps) {
    const fullName = `${member.first_name} ${member.last_name}`;

    return (
        <View style={styles.screen}>
            <LinearGradient
                colors={['#F59E0B', '#FFC107']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.header}
            >
                <View style={styles.titleRow}>
                    <View style={styles.backButtonRow}>
                        <IconButton icon="arrow-left" iconColor="#000000" onPress={onBack} style={styles.backButton} />
                    </View>
                    <View style={styles.titleTextRow}>
                        <Text style={styles.detailsTitle} className="text-[1.45rem] font-poppins-bold">
                            Details
                        </Text>
                    </View>
                </View>
            </LinearGradient>
            <View style={styles.headerInfo}>
                <Text className="text-2xl font-poppins-bold text-black">{fullName}</Text>
                <View style={styles.subtitleRow}>
                    <Text style={styles.subtitle}>{member.plan}</Text>
                    <MemberStatusPill member={member} />
                </View>
            </View>
            <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
                <DetailTable
                    rows={[
                        { label: 'Membership ID', value: member.id },
                        { label: 'Payment Date', value: formatDateOnly(member.payment_date) },
                        { label: 'Subscription Expiration', value: formatDateOnly(member.subscription_expiration_date) },
                        { label: 'Date Created', value: formatPhilippineTimestamp(member.date_created) },
                        { label: 'Date Updated', value: formatPhilippineTimestamp(member.date_updated) },
                    ]}
                />

                <View style={styles.actions}>
                    <Button mode="outlined" onPress={onEdit}>
                        Edit
                    </Button>
                    <Button mode="contained" buttonColor="#DC2626" onPress={onDelete}>
                        Delete
                    </Button>
                </View>
                <Text style={styles.footerSubtext}>Manage your subscribers right here</Text>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        height: '36%',
        justifyContent: 'flex-end',
        paddingHorizontal: 32,
        paddingBottom: 24,
    },
    titleRow: {
        width: '100%',
        height: 112,
        marginLeft: -12,
        gap: 8,
    },
    backButtonRow: {
        flex: 1,
        justifyContent: 'center',
    },
    backButton: {
        margin: 0,
    },
    titleTextRow: {
        flex: 1,
        justifyContent: 'center',
    },
    detailsTitle: {
        color: '#000000',
        fontWeight: 'bold',
    },
    headerInfo: {
        gap: 8,
        paddingHorizontal: 32,
        paddingTop: 24,
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        paddingHorizontal: 32,
        paddingTop: 24,
        paddingBottom: 32,
        gap: 12,
    },
    subtitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    subtitle: {
        color: '#5a3f00',
    },
    table: {
        width: '100%',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        paddingHorizontal: 16,
    },
    tableDivider: {
        backgroundColor: '#E5E7EB',
    },
    row: {
        gap: 2,
        paddingVertical: 12,
    },
    rowLabel: {
        color: '#6B7280',
        fontSize: 12,
    },
    rowValue: {
        color: '#3F2D00',
        fontSize: 16,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 8,
        marginTop: 12,
    },
    footerSubtext: {
        width: '100%',
        marginTop: 24,
        textAlign: 'center',
        color: '#9CA3AF',
        fontSize: 12,
    },
});
