import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/theme/index";
import type { Reminder } from "@/features/reminders/types";

interface EventRemindersSectionProps {
  /**
   * Array of reminders to display
   */
  reminders: Reminder[];
}

/**
 * Component displaying the reminders section for an event
 * Shows a list of reminders or an empty state message
 */
export const EventRemindersSection: React.FC<EventRemindersSectionProps> = ({
  reminders,
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.section, { backgroundColor: colors.surface }]}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          Reminders
        </Text>
        <Ionicons name="notifications" size={18} color={colors.textSecondary} />
      </View>
      {reminders.length === 0 ? (
        <Text style={[styles.emptyText, { color: colors.textTertiary }]}>
          No reminders set
        </Text>
      ) : (
        <View style={styles.remindersList}>
          {reminders.map((reminder) => (
            <View
              key={reminder.id}
              style={[
                styles.reminderItem,
                {
                  backgroundColor: colors.surface,
                  borderLeftColor: colors.primary,
                },
              ]}
            >
              <View style={styles.reminderItemLeft}>
                <View style={styles.reminderItemHeader}>
                  <Ionicons
                    name={reminder.type === "recurring" ? "repeat" : "time"}
                    size={20}
                    color={colors.primary}
                  />
                  <Text style={[styles.reminderType, { color: colors.text }]}>
                    {reminder.type === "recurring" ? "Recurring" : "One-time"}
                  </Text>
                </View>
                {reminder.recurrenceRule && (
                  <Text
                    style={[
                      styles.reminderRule,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {reminder.recurrenceRule.charAt(0).toUpperCase() +
                      reminder.recurrenceRule.slice(1)}
                  </Text>
                )}
                {reminder.scheduledAt && (
                  <Text
                    style={[
                      styles.reminderDate,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {reminder.scheduledAt.toLocaleDateString()} at{" "}
                    {reminder.scheduledAt.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                )}
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  emptyText: {
    fontSize: 14,
    fontStyle: "italic",
    textAlign: "center",
    paddingVertical: 16,
  },
  remindersList: {
    gap: 10,
  },
  reminderItem: {
    borderRadius: 8,
    padding: 14,
    borderLeftWidth: 3,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  reminderItemLeft: {
    flex: 1,
    marginRight: 12,
  },
  reminderItemHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  reminderType: {
    fontSize: 16,
    fontWeight: "600",
  },
  reminderRule: {
    fontSize: 14,
    marginTop: 4,
    lineHeight: 20,
  },
  reminderDate: {
    fontSize: 14,
    marginTop: 4,
    lineHeight: 20,
  },
});

