import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import DetailsNavbar from '../../components/DetailsNavbar';
import { commonStyles } from '../../components/commonStyles';
import type { Member } from '../../models/Member';
import { memberRepository } from '../../repositories/activeRepositories';
import { nowInPhilippineTime } from '../../utils/dateTime';
import { buildPaymentsCsv, buildSubscribersCsv, exportCsv } from '../../utils/exportData';
import { palette, themedStyles } from '../../utils/theme';

type ExportKind = 'subscribers' | 'payments';

// Settings > Export Data: each button saves (web) or shares (phone) one CSV file.
export default function ExportDataScreen({ onBack }: { onBack: () => void }) {
    const [members, setMembers] = useState<Member[] | null>(null);
    const [busy, setBusy] = useState<ExportKind | null>(null);
    const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

    useEffect(() => {
        return memberRepository.subscribe(
            (data) => setMembers(data),
            (err) => setMessage({ text: err.message, isError: true })
        );
    }, []);

    const handleExport = async (kind: ExportKind) => {
        if (!members) return;
        setBusy(kind);
        setMessage(null);
        try {
            const { csv, count } = kind === 'subscribers' ? buildSubscribersCsv(members) : buildPaymentsCsv(members);
            const filename = `prime-gym-${kind}-${nowInPhilippineTime().slice(0, 10)}.csv`;
            await exportCsv(filename, csv);
            setMessage({ text: `Exported ${count} ${count === 1 ? 'row' : 'rows'} to ${filename}.`, isError: false });
        } catch {
            setMessage({ text: 'Could not export the data. Please try again.', isError: true });
        } finally {
            setBusy(null);
        }
    };

    const subscriberCount = members ? buildSubscribersCsv(members).count : 0;
    const paymentCount = members ? buildPaymentsCsv(members).count : 0;

    return (
        <View style={styles.screen}>
            <DetailsNavbar title="Export Data" onBack={onBack} bordered={false} />
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Subscribers</Text>
                    <Text style={styles.cardDescription}>
                        {subscriberCount} subscribers with plan, status, payment and expiration date. Removed subscribers are included as Inactive.
                    </Text>
                    <Button
                        mode="contained"
                        textColor="#fff"
                        contentStyle={commonStyles.submitButtonContent}
                        labelStyle={styles.buttonLabel}
                        style={commonStyles.submitButton}
                        onPress={() => handleExport('subscribers')}
                        loading={busy === 'subscribers'}
                        disabled={!members || busy !== null}
                    >
                        Export Subscribers
                    </Button>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Payments</Text>
                    <Text style={styles.cardDescription}>
                        {paymentCount} subscription payments with date, subscriber, plan and amount, newest first.
                    </Text>
                    <Button
                        mode="contained"
                        textColor="#fff"
                        contentStyle={commonStyles.submitButtonContent}
                        labelStyle={styles.buttonLabel}
                        style={commonStyles.submitButton}
                        onPress={() => handleExport('payments')}
                        loading={busy === 'payments'}
                        disabled={!members || busy !== null}
                    >
                        Export Payments
                    </Button>
                </View>

                {message && <Text style={message.isError ? styles.errorText : styles.successText}>{message.text}</Text>}
                <Text style={styles.footer}>Files are CSV, which opens in Excel and Google Sheets.</Text>
            </ScrollView>
        </View>
    );
}

const styles = themedStyles(() => StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: palette.background,
    },
    content: {
        paddingHorizontal: 32,
        paddingVertical: 24,
        gap: 20,
    },
    card: {
        width: '100%',
        gap: 12,
        padding: 16,
        backgroundColor: palette.surface,
        borderWidth: 2,
        borderColor: palette.border,
        borderRadius: 12,
    },
    cardTitle: {
        color: palette.text,
        fontSize: 16,
        fontFamily: 'Poppins_700Bold',
    },
    cardDescription: {
        color: palette.muted,
        fontSize: 14,
        fontFamily: 'Poppins_400Regular',
    },
    buttonLabel: {
        fontSize: 17.2,
        lineHeight: 24,
    },
    successText: {
        color: palette.ok,
        fontSize: 12,
        fontFamily: 'Poppins_500Medium',
    },
    errorText: {
        color: palette.dangerText,
        fontSize: 12,
        fontFamily: 'Poppins_500Medium',
    },
    footer: {
        textAlign: 'center',
        color: palette.subtle,
        fontSize: 12,
        fontFamily: 'Poppins_400Regular',
    },
}));
