import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import DetailsNavbar from '../../components/DetailsNavbar';
import EquipmentStatusPill from '../../components/EquipmentStatusPill';
import type { Equipment } from '../../models/Equipment';
import { formatPhilippineTimestamp } from '../../utils/dateTime';

type EquipmentDetailsScreenProps = {
    equipment: Equipment;
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

export default function EquipmentDetailsScreen({ equipment, onBack, onEdit, onDelete }: EquipmentDetailsScreenProps) {
    return (
        <View style={styles.screen}>
            <DetailsNavbar onBack={onBack} />
            <View style={styles.headerInfo}>
                <Text className="text-2xl font-poppins-bold text-black">{equipment.title}</Text>
                <View style={styles.subtitleRow}>
                    <EquipmentStatusPill equipment={equipment} />
                </View>
            </View>
            <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
                <DetailRow label="Equipment ID" value={equipment.id} />
                <DetailRow label="Date Created" value={formatPhilippineTimestamp(equipment.date_created)} />
                <DetailRow label="Date Updated" value={formatPhilippineTimestamp(equipment.date_updated)} />

                <View style={styles.actions}>
                    <Button mode="outlined" onPress={onEdit}>
                        Edit
                    </Button>
                    <Button mode="contained" buttonColor="#DC2626" onPress={onDelete}>
                        Delete
                    </Button>
                </View>
                <Text style={styles.footerSubtext}>Manage your gym equipment right here</Text>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#fff',
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
    row: {
        gap: 2,
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
