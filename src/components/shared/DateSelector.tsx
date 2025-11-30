import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DateTimePicker } from "./DateTimePicker";
import { useTheme } from "@/theme";

interface DateSelectorProps {
  date: Date;
  onDateChange: (date: Date) => void;
  label?: string;
  maximumDate?: Date;
  minimumDate?: Date;
  editable?: boolean;
}

/**
 * Reusable component for selecting date only (no time)
 * Displays a button to open a date picker
 * Used for event start dates where time is not relevant
 */
export const DateSelector: React.FC<DateSelectorProps> = ({
  date,
  onDateChange,
  label,
  maximumDate,
  minimumDate,
  editable = true,
}) => {
  const { colors } = useTheme();
  const [showDatePicker, setShowDatePicker] = useState(false);

  /**
   * Normalizes a date to midnight (00:00:00) to remove time component
   * This ensures dates are stored without time information
   */
  const normalizeToMidnight = (date: Date): Date => {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
  };

  const handleDateConfirm = (selectedDate: Date) => {
    if (
      selectedDate &&
      selectedDate instanceof Date &&
      !isNaN(selectedDate.getTime())
    ) {
      // Normalize to midnight to remove time component
      const normalizedDate = normalizeToMidnight(selectedDate);
      onDateChange(normalizedDate);
    }
    setShowDatePicker(false);
  };

  const handleDateCancel = () => {
    setShowDatePicker(false);
  };

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      )}
      <TouchableOpacity
        style={[
          styles.dateButton,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            opacity: editable ? 1 : 0.6,
          },
        ]}
        onPress={() => editable && setShowDatePicker(true)}
        accessibilityRole="button"
        accessibilityLabel="Select date"
        activeOpacity={editable ? 0.7 : 1}
        disabled={!editable}
      >
        <Text style={[styles.dateText, { color: colors.text }]}>
          {/* TODO: Replace hardcoded locale 'en-US' with user's language preference from settings */}
          {normalizeToMidnight(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Text>
        <Ionicons
          name="calendar-outline"
          size={20}
          color={colors.textSecondary}
        />
      </TouchableOpacity>
      {editable && (
        <DateTimePicker
          isVisible={showDatePicker}
          date={normalizeToMidnight(date)}
          onConfirm={handleDateConfirm}
          onCancel={handleDateCancel}
          mode="date"
          maximumDate={maximumDate}
          minimumDate={minimumDate}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  dateButton: {
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateText: {
    fontSize: 16,
    flex: 1,
  },
});

