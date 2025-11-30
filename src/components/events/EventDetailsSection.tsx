import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { DateTimeSelector } from "@/components/shared/DateTimeSelector";
import { useTheme } from "@/theme/index";
import type { Event } from "@/features/events/types";

interface EventDetailsSectionProps {
  /**
   * The event to display details for
   */
  event: Event;
}

/**
 * Component displaying the details section of an event
 * Shows title, description, start date, and display unit
 */
export const EventDetailsSection: React.FC<EventDetailsSectionProps> = ({
  event,
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.section, { backgroundColor: colors.surface }]}>
      {/* TODO: Replace hardcoded section titles and labels with i18n translations */}
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
        Details
      </Text>
      <Text style={[styles.title, { color: colors.text }]}>{event.title}</Text>
      {event.description && (
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          {event.description}
        </Text>
      )}
      <DateTimeSelector
        date={event.startDate}
        onDateChange={() => {}} // Read-only, no-op
        label="Started"
        editable={false}
      />
      <Text style={[styles.metaText, { color: colors.textTertiary }]}>
        Displaying as: {event.showTimeAs}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 12,
  },
  metaText: {
    fontSize: 14,
    marginTop: 4,
  },
});

