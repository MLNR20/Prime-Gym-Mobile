import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Dialog, Portal, Text } from 'react-native-paper';
import type { Member } from '../models/Member';
import { getMemberStatus } from '../utils/memberStatus';
import MemberStatusPill from './MemberStatusPill';
import { palette, themedStyles } from '../utils/theme';

type AssignSubscriberDialogProps = {
    visible: boolean;
    programName: string;
    /** Id of the program being assigned, to mark subscribers who are already on it. */
    programId: string;
    subscribers: Member[];
    /** Rejects (e.g. when the subscription has expired) with a message that is shown in the dialog. */
    onAssign: (member: Member) => Promise<void>;
    onDismiss: () => void;
};

// Lists every subscriber; only those with a valid (non-expired) subscription can be picked.
export default function AssignSubscriberDialog({ visible, programName, programId, subscribers, onAssign, onDismiss }: AssignSubscriberDialogProps) {
    const [error, setError] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        if (visible) setError(null);
    }, [visible]);

    const handlePick = async (member: Member) => {
        setBusy(true);
        setError(null);
        try {
            await onAssign(member);
            onDismiss();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Could not assign this subscriber.');
        } finally {
            setBusy(false);
        }
    };

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialog}>
                <Dialog.Title style={styles.title}>Assign to {programName}</Dialog.Title>
                <Dialog.Content>
                    <Text style={styles.hint}>Only subscribers with an active subscription can be assigned.</Text>
                    {!!error && <Text style={styles.error}>{error}</Text>}
                </Dialog.Content>
                <Dialog.ScrollArea style={styles.scrollArea}>
                    <ScrollView>
                        {subscribers.length === 0 && <Text style={styles.empty}>No subscribers yet.</Text>}
                        {subscribers.map((member) => {
                            const eligible = getMemberStatus(member) === 'active';
                            const alreadyAssigned = member.program_id === programId;
                            return (
                                <Pressable
                                    key={member.id}
                                    disabled={!eligible || alreadyAssigned || busy}
                                    onPress={() => handlePick(member)}
                                    style={[styles.row, (!eligible || alreadyAssigned) && styles.rowDisabled]}
                                    accessibilityLabel={`Assign ${member.first_name} ${member.last_name}`}
                                >
                                    <View style={styles.rowText}>
                                        <Text style={styles.name}>{`${member.first_name} ${member.last_name}`}</Text>
                                        <Text style={styles.meta}>{alreadyAssigned ? 'Already assigned' : member.plan}</Text>
                                    </View>
                                    <MemberStatusPill member={member} />
                                </Pressable>
                            );
                        })}
                    </ScrollView>
                </Dialog.ScrollArea>
                <Dialog.Actions>
                    <Button textColor={palette.muted} onPress={onDismiss}>
                        Cancel
                    </Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
}

const styles = themedStyles(() => StyleSheet.create({
    dialog: {
        backgroundColor: palette.background,
        borderRadius: 12,
    },
    title: {
        fontFamily: 'Poppins_700Bold',
    },
    hint: {
        color: palette.muted,
        fontFamily: 'Poppins_400Regular',
    },
    error: {
        marginTop: 8,
        color: palette.danger,
        fontFamily: 'Poppins_600SemiBold',
    },
    scrollArea: {
        maxHeight: 320,
        paddingHorizontal: 0,
    },
    empty: {
        padding: 24,
        textAlign: 'center',
        color: palette.subtle,
        fontFamily: 'Poppins_400Regular',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        paddingHorizontal: 24,
        paddingVertical: 12,
    },
    rowDisabled: {
        opacity: 0.5,
    },
    rowText: {
        flex: 1,
    },
    name: {
        color: palette.text,
        fontFamily: 'Poppins_600SemiBold',
    },
    meta: {
        color: palette.muted,
        fontFamily: 'Poppins_400Regular',
    },
}));
