import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { addDays, addWeeks, addMonths, addYears } from "date-fns";
import { useTheme } from "@/theme/index";
import { isMilestoneReached } from "@/config/milestones";
import type { Milestone } from "@/features/milestones/types";
import type { Event } from "@/features/events/types";
import type { TimeUnit } from "@/config/types";

interface EventMilestonesSectionProps {
  /**
   * Array of milestones to display
   */
  milestones: Milestone[];
  /**
   * The event associated with these milestones (used for calculating reached status)
   */
  event: Event;
}

/**
 * Converts a milestone's target amount and unit to days for sorting purposes
 */
const convertMilestoneToDays = (
  targetAmount: number,
  targetUnit: TimeUnit
): number => {
  switch (targetUnit) {
    case "days":
      return targetAmount;
    case "weeks":
      return targetAmount * 7;
    case "months":
      return targetAmount * 30.44; // Average days per month
    case "years":
      return targetAmount * 365.25; // Average days per year
    default:
      return targetAmount;
  }
};

/**
 * Calculates the date when a milestone was reached based on the event start date
 * If milestone.reachedAt exists, returns that. Otherwise calculates it from startDate + target
 */
const getMilestoneReachedDate = (
  milestone: Milestone,
  eventStartDate: Date
): Date | null => {
  // If milestone already has a reachedAt date, use it
  if (milestone.reachedAt) {
    return milestone.reachedAt;
  }

  // Check if milestone has been reached
  const reached = isMilestoneReached(
    {
      label: milestone.label,
      targetAmount: milestone.targetAmount,
      targetUnit: milestone.targetUnit,
      isPredefined: true,
    },
    eventStartDate
  );

  if (!reached) {
    return null;
  }

  // Calculate the reached date by adding the target amount/unit to the start date
  switch (milestone.targetUnit) {
    case "days":
      return addDays(eventStartDate, milestone.targetAmount);
    case "weeks":
      return addWeeks(eventStartDate, milestone.targetAmount);
    case "months":
      return addMonths(eventStartDate, milestone.targetAmount);
    case "years":
      return addYears(eventStartDate, milestone.targetAmount);
    default:
      return null;
  }
};

/**
 * Component displaying the milestones section for an event
 * Shows a list of milestones with reached status and a "show more" button if there are more than 5
 * Milestones are sorted by their actual time value (converted to days)
 */
export const EventMilestonesSection: React.FC<EventMilestonesSectionProps> = ({
  milestones,
  event,
}) => {
  const { colors } = useTheme();
  const [showAllMilestones, setShowAllMilestones] = useState(false);

  /**
   * Sort milestones by their actual time value (converted to days)
   * This ensures milestones are displayed in chronological order regardless of their unit
   */
  const sortedMilestones = useMemo(() => {
    return [...milestones].sort((a, b) => {
      const daysA = convertMilestoneToDays(a.targetAmount, a.targetUnit);
      const daysB = convertMilestoneToDays(b.targetAmount, b.targetUnit);
      return daysA - daysB;
    });
  }, [milestones]);

  if (milestones.length === 0) {
    return (
      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            Milestones
          </Text>
          <Ionicons name="trophy" size={18} color={colors.textSecondary} />
        </View>
        <Text style={[styles.emptyText, { color: colors.textTertiary }]}>
          No milestones yet
        </Text>
      </View>
    );
  }

  const displayedMilestones = showAllMilestones
    ? sortedMilestones
    : sortedMilestones.slice(0, 5);

  return (
    <View style={[styles.section, { backgroundColor: colors.surface }]}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          Milestones
        </Text>
        <Ionicons name="trophy" size={18} color={colors.textSecondary} />
      </View>
      <View style={styles.milestonesList}>
        {displayedMilestones.map((milestone) => {
          const reached =
            milestone.reachedAt !== null ||
            isMilestoneReached(
              {
                label: milestone.label,
                targetAmount: milestone.targetAmount,
                targetUnit: milestone.targetUnit,
                isPredefined: true,
              },
              event.startDate
            );

          // Calculate or get the reached date
          const reachedDate = getMilestoneReachedDate(
            milestone,
            event.startDate
          );

          return (
            <View
              key={milestone.id}
              style={[
                styles.milestoneItem,
                {
                  backgroundColor: reached
                    ? colors.primary + "15"
                    : colors.background,
                  borderLeftColor: reached ? colors.primary : colors.border,
                },
              ]}
            >
              <View style={styles.milestoneContent}>
                <View style={styles.milestoneHeader}>
                  <Text style={[styles.milestoneLabel, { color: colors.text }]}>
                    {milestone.label}
                  </Text>
                  {reached && (
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color={colors.primary}
                    />
                  )}
                </View>
                <Text
                  style={[
                    styles.milestoneTarget,
                    { color: colors.textSecondary },
                  ]}
                >
                  {milestone.targetAmount} {milestone.targetUnit}
                  {reachedDate && (
                    <Text style={{ color: colors.primary }}>
                      {" "}
                      • Reached {reachedDate.toLocaleDateString()}
                    </Text>
                  )}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
      {milestones.length > 5 && (
        <TouchableOpacity
          onPress={() => setShowAllMilestones(!showAllMilestones)}
          style={styles.showMoreButton}
          accessibilityRole="button"
          accessibilityLabel={
            showAllMilestones ? "Show fewer milestones" : "Show all milestones"
          }
        >
          <Text style={[styles.showMoreText, { color: colors.primary }]}>
            {showAllMilestones
              ? "Show Less"
              : `Show All (${milestones.length})`}
          </Text>
          <Ionicons
            name={showAllMilestones ? "chevron-up" : "chevron-down"}
            size={18}
            color={colors.primary}
          />
        </TouchableOpacity>
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
  milestonesList: {
    gap: 8,
  },
  milestoneItem: {
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 3,
  },
  milestoneContent: {
    flex: 1,
  },
  milestoneHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  milestoneLabel: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  milestoneTarget: {
    fontSize: 14,
  },
  showMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginTop: 8,
    gap: 6,
  },
  showMoreText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
