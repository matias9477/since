import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DateTimePicker } from "./DateTimePicker";
import { useTheme } from "@/theme";

interface DateTimeSelectorProps {
  date: Date;
  onDateChange: (date: Date) => void;
  label?: string;
  maximumDate?: Date;
  minimumDate?: Date;
  editable?: boolean;
}

/**
 * Reusable component for selecting date and time
 * Displays two buttons side by side - one for date, one for time
 * Used in both EditEventScreen and EventDetailScreen
 */
export const DateTimeSelector: React.FC<DateTimeSelectorProps> = ({
  date,
  onDateChange,
  label,
  maximumDate,
  minimumDate,
  editable = true,
}) => {
  const { colors } = useTheme();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Create a date object for time picker using a fixed date (Jan 1, 2000)
  // This ensures no date constraints affect the time selection
  // We only care about the time portion, so the date doesn't matter
  const getTimePickerDate = () => {
    const timeDate = new Date(date);
    // Use a fixed date in the past to avoid any constraints
    return new Date(
      2000,
      0,
      1,
      timeDate.getHours(),
      timeDate.getMinutes(),
      timeDate.getSeconds()
    );
  };

  const handleDateConfirm = (selectedDate: Date) => {
    if (
      selectedDate &&
      selectedDate instanceof Date &&
      !isNaN(selectedDate.getTime())
    ) {
      // Preserve the existing time when updating the date
      const newDate = new Date(selectedDate);
      newDate.setHours(date.getHours());
      newDate.setMinutes(date.getMinutes());
      newDate.setSeconds(date.getSeconds());
      onDateChange(newDate);
    }
    setShowDatePicker(false);
  };

  const handleDateCancel = () => {
    setShowDatePicker(false);
  };

  const handleTimeConfirm = (selectedTime: Date) => {
    if (
      selectedTime &&
      selectedTime instanceof Date &&
      !isNaN(selectedTime.getTime())
    ) {
      // Preserve the existing date when updating the time
      const newDate = new Date(date);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      newDate.setSeconds(selectedTime.getSeconds());
      onDateChange(newDate);
    }
    setShowTimePicker(false);
  };

  const handleTimeCancel = () => {
    setShowTimePicker(false);
  };

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      )}
      <View style={styles.dateTimeRow}>
        <TouchableOpacity
          style={[
            styles.dateButton,
            styles.dateTimeButton,
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
            {date.toLocaleDateString("en-US", {
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
        <TouchableOpacity
          style={[
            styles.dateButton,
            styles.dateTimeButton,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              opacity: editable ? 1 : 0.6,
            },
          ]}
          onPress={() => editable && setShowTimePicker(true)}
          accessibilityRole="button"
          accessibilityLabel="Select time"
          activeOpacity={editable ? 0.7 : 1}
          disabled={!editable}
        >
          <Text style={[styles.dateText, { color: colors.text }]}>
            {date.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
          <Ionicons
            name="time-outline"
            size={20}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      </View>
      {editable && (
        <>
          <DateTimePicker
            isVisible={showDatePicker}
            date={date}
            onConfirm={handleDateConfirm}
            onCancel={handleDateCancel}
            mode="date"
            maximumDate={maximumDate}
            minimumDate={minimumDate}
          />
          <DateTimePicker
            isVisible={showTimePicker}
            date={getTimePickerDate()}
            onConfirm={handleTimeConfirm}
            onCancel={handleTimeCancel}
            mode="time"
          />
        </>
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
  dateTimeRow: {
    flexDirection: "row",
    gap: 12,
  },
  dateButton: {
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateTimeButton: {
    flex: 1,
  },
  dateText: {
    fontSize: 16,
    flex: 1,
  },
});
