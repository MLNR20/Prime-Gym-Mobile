import { useState } from 'react';
import { FlatList, ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, IconButton, List, Text } from 'react-native-paper';
import DetailsNavbar from '../../components/DetailsNavbar';
import PlanForm, { type PlanFormValues } from '../../components/PlanForm';
import { commonStyles } from '../../components/commonStyles';
import { formatPeso } from '../../utils/currency';
import { usePlansViewModel } from '../../viewmodels/usePlansViewModel';
import { palette, themedStyles } from '../../utils/theme';

// Settings > Membership Plans: the plans a subscriber can be put on. Tap a plan to edit it, trash to remove it.
export default function PlansScreen({ onBack }: { onBack: () => void }) {
    const { plans, loading, error, editingPlan, startEditing, cancelEditing, submitPlan, removePlan } = usePlansViewModel();
    const [isAdding, setIsAdding] = useState(false);

    const closeForm = () => {
        setIsAdding(false);
        cancelEditing();
    };

    const handleSubmit = async (values: PlanFormValues) => {
        await submitPlan(values);
        setIsAdding(false);
    };

    if (isAdding || editingPlan) {
        return (
            <View style={styles.screen}>
                <DetailsNavbar title={editingPlan ? 'Edit Plan' : 'Add Plan'} onBack={closeForm} bordered={false} />
                <ScrollView contentContainerStyle={styles.formContent}>
                    <PlanForm editingPlan={editingPlan} onSubmit={handleSubmit} onCancel={closeForm} />
                </ScrollView>
            </View>
        );
    }

    return (
        <View style={styles.screen}>
            <DetailsNavbar title="Membership Plans" onBack={onBack} rightIcon="plus" onRightPress={() => setIsAdding(true)} />
            <View style={styles.content}>
                {loading && <ActivityIndicator style={styles.spinner} />}
                {!loading && error && <Text style={styles.message}>{error}</Text>}
                {!loading && !error && (
                    <FlatList
                        data={plans}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listItems}
                        renderItem={({ item }) => (
                            <List.Item
                                title={item.name}
                                description={`${formatPeso(item.price)} · ${item.duration_months} ${item.duration_months === 1 ? 'month' : 'months'}`}
                                titleStyle={commonStyles.cardTitle}
                                style={commonStyles.cardForListView}
                                onPress={() => startEditing(item)}
                                right={() => (
                                    <IconButton
                                        icon="trash-can-outline"
                                        size={22}
                                        iconColor={palette.iconMuted}
                                        onPress={() => removePlan(item)}
                                        style={styles.action}
                                        accessibilityLabel={`Delete ${item.name}`}
                                    />
                                )}
                            />
                        )}
                        ListEmptyComponent={<Text style={styles.message}>No plans yet. Tap + to add one.</Text>}
                        ListFooterComponent={
                            plans.length > 0 ? (
                                <Text style={styles.footer}>Subscribers already on a deleted plan keep it.</Text>
                            ) : undefined
                        }
                    />
                )}
            </View>
        </View>
    );
}

const styles = themedStyles(() => StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: palette.background,
    },
    content: {
        flex: 1,
        paddingHorizontal: 32,
        paddingTop: 24,
    },
    formContent: {
        paddingHorizontal: 32,
        paddingVertical: 24,
    },
    listItems: {
        gap: 12,
    },
    spinner: {
        paddingVertical: 12,
    },
    message: {
        color: palette.brown,
        fontFamily: 'Poppins_400Regular',
    },
    footer: {
        marginTop: 12,
        textAlign: 'center',
        color: palette.subtle,
        fontFamily: 'Poppins_400Regular',
        fontSize: 12,
    },
    action: {
        margin: 0,
    },
}));
