import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Menu, Text } from 'react-native-paper';
import { FormLabel } from './FormTextInput';

export type SelectOption<T extends string> = { value: T; label: string };

type FormSelectProps<T extends string> = {
    label: string;
    value: T | '';
    options: readonly SelectOption<T>[];
    onChange: (value: T) => void;
    placeholder?: string;
};

// Gray-filled dropdown that matches FormTextInput.
export default function FormSelect<T extends string>({ label, value, options, onChange, placeholder = 'Select' }: FormSelectProps<T>) {
    const [open, setOpen] = useState(false);
    const [width, setWidth] = useState<number>();
    const selected = options.find((option) => option.value === value);

    return (
        <View style={styles.field}>
            <FormLabel>{label}</FormLabel>
            <View onLayout={(event) => setWidth(event.nativeEvent.layout.width)}>
                <Menu
                    visible={open}
                    onDismiss={() => setOpen(false)}
                    contentStyle={[styles.menu, { width }]}
                    anchorPosition="bottom"
                    anchor={
                        <Pressable style={styles.select} onPress={() => setOpen(true)}>
                            <Text style={selected ? styles.value : styles.placeholder}>{selected?.label ?? placeholder}</Text>
                            <Text style={styles.chevron}>{open ? '▲' : '▼'}</Text>
                        </Pressable>
                    }
                >
                    <ScrollView style={styles.optionList}>
                        {options.length === 0 && <Menu.Item title="No options" disabled />}
                        {options.map((option) => (
                            <Menu.Item
                                key={option.value}
                                title={option.label}
                                onPress={() => {
                                    onChange(option.value);
                                    setOpen(false);
                                }}
                                titleStyle={option.value === value ? styles.selectedOption : styles.option}
                            />
                        ))}
                    </ScrollView>
                </Menu>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    field: {
        width: '100%',
        gap: 6,
    },
    select: {
        height: 56,
        borderRadius: 8,
        backgroundColor: '#F2F5F7',
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    value: {
        fontSize: 16,
        color: '#000000',
    },
    placeholder: {
        fontSize: 16,
        color: '#9CA3AF',
    },
    optionList: {
        maxHeight: 240,
    },
    chevron: {
        fontSize: 10,
        color: '#9CA3AF',
    },
    menu: {
        backgroundColor: '#E5E7EB',
    },
    option: {
        color: '#111827',
    },
    selectedOption: {
        color: '#F59E0B',
        fontWeight: 'bold',
    },
});
