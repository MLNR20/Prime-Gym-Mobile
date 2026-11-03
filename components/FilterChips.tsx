import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import type { SelectOption } from './FormSelect';
import { palette, themedStyles } from '../utils/theme';

type FilterChipsProps<T extends string> = {
    label: string;
    value: T;
    options: readonly SelectOption<T>[];
    onChange: (value: T) => void;
};

// A labeled, horizontally scrolling row of single-select chips used to filter a list.
export default function FilterChips<T extends string>({ label, value, options, onChange }: FilterChipsProps<T>) {
    return (
        <View style={styles.group}>
            <Text style={styles.label}>{label}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
                {options.map((option) => {
                    const selected = option.value === value;
                    return (
                        <Pressable
                            key={option.value}
                            onPress={() => onChange(option.value)}
                            style={[styles.chip, selected && styles.chipSelected]}
                        >
                            <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{option.label}</Text>
                        </Pressable>
                    );
                })}
            </ScrollView>
        </View>
    );
}

const styles = themedStyles(() => StyleSheet.create({
    group: {
        gap: 6,
    },
    label: {
        color: palette.muted,
        fontSize: 12,
        fontFamily: 'Poppins_500Medium',
    },
    row: {
        gap: 8,
    },
    chip: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 999,
        backgroundColor: palette.surface,
        borderWidth: 2,
        borderColor: palette.border,
    },
    chipSelected: {
        backgroundColor: '#F59E0B',
        borderColor: '#F59E0B',
    },
    chipText: {
        color: palette.bodyText,
        fontSize: 13,
        fontFamily: 'Poppins_500Medium',
    },
    chipTextSelected: {
        color: '#000000',
    },
}));
