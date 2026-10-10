import { useState } from "react";
import { LayoutChangeEvent, Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { quickActionsGridStyles as styles } from "./commonStyles";

type QuickAction = {
  key: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconBg?: string;
};

const actions: QuickAction[] = [
  { key: "attendance", label: "Attendance", icon: "checkmark-done-outline" },
  { key: "finance", label: "Finance", icon: "cash-outline" },
  { key: "members", label: "Members", icon: "people-outline" },
  { key: "exercise", label: "Exercise", icon: "barbell-outline" },
  { key: "equipment", label: "Equipment", icon: "fitness-outline" },
  { key: "reports", label: "Reports", icon: "bar-chart-outline" },
  { key: "settings", label: "Settings", icon: "settings-outline" },
  { key: "audit", label: "Audit", icon: "clipboard-outline" },
];

const COLUMNS = 4;
const DEFAULT_ITEM_SIZE = 60;
const ICON_DECREASE = 0.1 * 16;
function chunkIntoRows<T>(items: T[], columns: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += columns) {
    rows.push(items.slice(i, i + columns));
  }
  return rows;
}

export default function QuickActionsGrid({
  onPress,
}: {
  onPress?: (key: string) => void;
}) {
  const rows = chunkIntoRows(actions, COLUMNS);
  const [itemSize, setItemSize] = useState(DEFAULT_ITEM_SIZE);

  const handleItemLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    if (Math.abs(width - itemSize) > 1) {
      setItemSize(width);
    }
  };

  const baseWrapperSize = Math.min(itemSize * 0.65, 56);
  const iconWrapperSize = baseWrapperSize - ICON_DECREASE;
  const iconSize = baseWrapperSize * 0.6 - ICON_DECREASE;

  return (
    <View style={styles.container}>
      <Text className="text-lg font-poppins-bold text-black">Services</Text>
      <View style={styles.card}>
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((action, actionIndex) => (
              <View
                key={action.key}
                style={styles.cell}
                onLayout={
                  rowIndex === 0 && actionIndex === 0
                    ? handleItemLayout
                    : undefined
                }
              >
                <Pressable
                  style={styles.pressable}
                  onPress={() => onPress?.(action.key)}
                  android_ripple={null}
                >
                  <View style={styles.item}>
                  <View style={styles.iconContainer}>
                    <View
                      style={[
                        styles.iconWrapper,
                        { width: iconWrapperSize, height: iconWrapperSize },
                        action.iconBg ? { backgroundColor: action.iconBg } : null,
                      ]}
                    >
                      <Ionicons
                        name={action.icon}
                        size={iconSize}
                        color="#FBBF77"
                        style={styles.icon}
                      />
                    </View>
                  </View>
                  <View style={styles.labelContainer}>
                    <Text
                      className="font-poppins-semibold text-black"
                      style={styles.label}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      minimumFontScale={0.8}
                    >
                      {action.label}
                    </Text>
                  </View>
                  </View>
                </Pressable>
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}
