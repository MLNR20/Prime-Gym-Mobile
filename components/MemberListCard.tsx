import type { ReactNode } from 'react';
import { SectionList, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Avatar, List, Searchbar, Text } from 'react-native-paper';
import type { Member } from '../models/Member';
import {commonStyles} from './commonStyles';
import MemberStatusPill from './MemberStatusPill';
import PaymentDateDivider from './PaymentDateDivider';

type PaymentDateSection = {
    title: string;
    data: Member[];
};

/** Groups members by their exact payment_date so same-date payments render as one category. */
function groupMembersByPaymentDate(members: Member[]): PaymentDateSection[] {
    const groups = new Map<string, Member[]>();
    for (const member of members) {
        const group = groups.get(member.payment_date);
        if (group) group.push(member);
        else groups.set(member.payment_date, [member]);
    }
    return Array.from(groups.entries())
        .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
        .map(([date, data]) => ({ title: date, data }));
}

type MemberListCardProps = {
    title?: string;
    members: Member[];
    query: string;
    onQueryChange: (query: string) => void;
    loading?: boolean;
    error?: string | null;
    emptyLabel?: string;
    renderRight?: (member: Member) => ReactNode;
    onItemPress?: (member: Member) => void;
    /** Set false when the search bar is rendered elsewhere (e.g. in a screen header) but should keep filtering this list. */
    showSearchBar?: boolean;
};

export default function MemberListCard({
    title = 'Members',
    members = [],
    query,
    onQueryChange,
    loading = false,
    error = null,
    emptyLabel = 'No members found.',
    renderRight,
    onItemPress,
    showSearchBar = true,
}: MemberListCardProps) {
    return (
        <View style={[commonStyles.listView, styles.flexFill]}>
            {showSearchBar && (
                <Searchbar placeholder="Search members" onChangeText={onQueryChange} style={commonStyles.searchBar} placeholderTextColor="#9CA3AF" value={query} />
            )}
            {loading && <ActivityIndicator style={styles.spinner} />}
            {!loading && error && (
                <Text style={styles.itemDescription} className="font-poppins text-base">{error}</Text>
            )}
            {!loading && !error && (
                <SectionList
                    style={styles.flexFill}
                    sections={groupMembersByPaymentDate(members)}
                    keyExtractor={(member) => member.id}
                    contentContainerStyle={styles.listItems}
                    renderItem={({ item: member }) => {
                        const fullName = `${member.first_name} ${member.last_name}`;
                        return (
                            <List.Item
                                title={fullName}
                                description={() => (
                                    <View style={styles.descriptionRow}>
                                        <MemberStatusPill member={member} />
                                    </View>
                                )}
                                titleStyle={styles.itemTitle}
                                style={[commonStyles.cardForListView, styles.itemCard]}
                                onPress={onItemPress ? () => onItemPress(member) : undefined}
                                right={renderRight ? () => renderRight(member) : undefined}
                            />
                        );
                    }}
                    renderSectionFooter={({ section }) => (
                        <PaymentDateDivider paymentDate={section.title} />
                    )}
                    ListEmptyComponent={
                        <Text style={styles.itemDescription} className="font-poppins text-base">{emptyLabel}</Text>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    itemCard: {
        backgroundColor: '#F2F5F7', // same as the search bar
        borderWidth: 2,
        borderColor: '#EDF0F2',
    },
    flexFill: {
        flex: 1,
    },
    listItems: {
        gap: 12,
    },
    container: {
        width: '100%',
        gap: 12,
        backgroundColor: '#FCD34D',
        borderRadius: 16,
        padding: 16,
    },
    heading: {
        color: '#3F2D00',
    },
    itemTitle: commonStyles.cardTitle,
    itemDescription: {
        color: '#5C4300',
    },
    descriptionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 8,
    },
    spinner: {
        paddingVertical: 12,
    },
});
