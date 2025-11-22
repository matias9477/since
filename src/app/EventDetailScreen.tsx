import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEventsStore } from "@/features/events/eventsStore";
import { useMilestonesStore } from "@/features/milestones/milestonesStore";
import { useRemindersStore } from "@/features/reminders/remindersStore";
import { TIME_UNITS } from "@/config/constants";
import { isMilestoneReached } from "@/config/milestones";
import { DateTimeSelector } from "@/components/DateTimeSelector";
import { useTheme } from "@/theme/index";
import type { TimeUnit } from "@/config/types";
import type { RootStackParamList } from "@/navigation/types";
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from "date-fns";
import { formatTimeSince } from "@/lib/formatTimeSince";

/**
 * Extended time unit type for frontend-only units (hours, minutes, seconds)
 * These are not stored in the backend but can be displayed in the details screen
 */
type ExtendedTimeUnit = TimeUnit | "hours" | "minutes" | "seconds";

/**
 * All available time units in order from largest to smallest
 */
const ALL_TIME_UNITS: ExtendedTimeUnit[] = ["years", "months", "weeks", "days", "hours", "minutes", "seconds"];

/**
 * Formats time for extended units (including hours, minutes, seconds)
 * For hours, minutes, and seconds, shows only the total count (no compound units)
 * Falls back to formatTimeSince for standard units
 */
const formatExtendedTimeSince = (startDate: Date, unit: ExtendedTimeUnit): string => {
  const now = new Date();

  switch (unit) {
    case "hours": {
      const totalHours = differenceInHours(now, startDate);
      const unitLabel = totalHours === 1 ? "hour" : "hours";
      return `${totalHours} ${unitLabel}`;
    }

    case "minutes": {
      const totalMinutes = differenceInMinutes(now, startDate);
      const unitLabel = totalMinutes === 1 ? "minute" : "minutes";
      return `${totalMinutes} ${unitLabel}`;
    }

    case "seconds": {
      const totalSeconds = differenceInSeconds(now, startDate);
      const unitLabel = totalSeconds === 1 ? "second" : "seconds";
      return `${totalSeconds} ${unitLabel}`;
    }

    default:
      // Use the standard formatter for days, weeks, months, years
      return formatTimeSince(startDate, unit as TimeUnit);
  }
};

type EventDetailScreenRouteProp = RouteProp<RootStackParamList, "EventDetail">;
type EventDetailScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "EventDetail"
>;

/**
 * Screen displaying detailed information about an event
 */
export const EventDetailScreen: React.FC = () => {
  const navigation = useNavigation<EventDetailScreenNavigationProp>();
  const route = useRoute<EventDetailScreenRouteProp>();
  const { eventId } = route.params;
  const { getEventById, loadEvents } = useEventsStore();
  const { milestones, loadMilestones, getMilestonesByEventId } =
    useMilestonesStore();
  const { reminders, loadReminders, getRemindersByEventId } =
    useRemindersStore();
  const { colors } = useTheme();
  const [refreshKey, setRefreshKey] = useState(0);
  const [previewUnit, setPreviewUnit] = useState<ExtendedTimeUnit | null>(null);
  const [showAllMilestones, setShowAllMilestones] = useState(false);

  const event = getEventById(eventId);
  const eventMilestones = getMilestonesByEventId(eventId);
  const eventReminders = getRemindersByEventId(eventId);

  // Initialize preview unit with event's actual unit when event loads
  useEffect(() => {
    if (event && previewUnit === null) {
      setPreviewUnit(event.showTimeAs);
    }
  }, [event, previewUnit]);

  /**
   * Gets the allowed time units for cycling based on the event's original unit
   * Only allows cycling to smaller or equal units (including hours, minutes, seconds)
   */
  const getAllowedUnits = (): ExtendedTimeUnit[] => {
    if (!event) return [];
    const originalUnit = event.showTimeAs;
    const originalIndex = ALL_TIME_UNITS.indexOf(originalUnit);
    // Return all units from the original unit down to seconds (inclusive)
    return ALL_TIME_UNITS.slice(originalIndex);
  };

  /**
   * Cycles to the next time unit (only within allowed units)
   */
  const handleNextUnit = () => {
    if (!event) return;
    const allowedUnits = getAllowedUnits();
    const currentUnit = previewUnit || event.showTimeAs;
    const currentIndex = allowedUnits.indexOf(currentUnit);
    const nextIndex = (currentIndex + 1) % allowedUnits.length;
    setPreviewUnit(allowedUnits[nextIndex]);
  };

  /**
   * Cycles to the previous time unit (only within allowed units)
   */
  const handlePreviousUnit = () => {
    if (!event) return;
    const allowedUnits = getAllowedUnits();
    const currentUnit = previewUnit || event.showTimeAs;
    const currentIndex = allowedUnits.indexOf(currentUnit);
    const prevIndex =
      (currentIndex - 1 + allowedUnits.length) % allowedUnits.length;
    setPreviewUnit(allowedUnits[prevIndex]);
  };

  useEffect(() => {
    if (!event) {
      loadEvents();
    }
  }, [event, loadEvents]);

  useEffect(() => {
    if (eventId) {
      loadMilestones(eventId);
      loadReminders(eventId);
    }
  }, [eventId, loadMilestones, loadReminders]);

  // Refresh time display periodically
  // For seconds: update every second
  // For minutes: update every minute (60000ms)
  // For other units: update every minute
  useEffect(() => {
    const currentUnit = previewUnit || event?.showTimeAs;
    const isSeconds = currentUnit === "seconds";
    const isMinutes = currentUnit === "minutes";
    
    const interval = isSeconds 
      ? 1000 // 1 second for seconds
      : isMinutes 
      ? 60000 // 1 minute for minutes
      : 60000; // 1 minute for other units

    const timer = setInterval(() => {
      setRefreshKey((prev) => prev + 1);
    }, interval);

    return () => clearInterval(timer);
  }, [previewUnit, event?.showTimeAs]);

  useEffect(() => {
    // TODO: Replace hardcoded strings with i18n translations
    navigation.setOptions({
      title: event?.title || "Event Details",
      headerRight: () => (
        <View style={styles.headerButtons}>
          <TouchableOpacity
            onPress={handleEdit}
            style={styles.headerButton}
            accessibilityRole="button"
            accessibilityLabel="Edit event"
          >
            <Text style={[styles.headerButtonText, { color: colors.primary }]}>
              Edit
            </Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, event]);

  const handleEdit = () => {
    navigation.navigate("EditEvent", { eventId });
  };

  if (!event) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          styles.centerContainer,
          { backgroundColor: colors.background },
        ]}
        edges={["bottom"]}
      >
        {/* TODO: Replace hardcoded error message with i18n translations */}
        <Text style={[styles.errorText, { color: colors.textTertiary }]}>
          Event not found
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["bottom"]}
    >
      <ScrollView style={styles.scrollView} key={refreshKey}>
        <View style={styles.content}>
          <View
            style={[
              styles.timeDisplay,
              { backgroundColor: colors.surface, shadowColor: colors.shadow },
            ]}
          >
            <View style={styles.timeDisplayRow}>
              <TouchableOpacity
                style={styles.arrowButton}
                onPress={handlePreviousUnit}
                accessibilityRole="button"
                accessibilityLabel="Previous time unit"
                activeOpacity={0.7}
              >
                <Ionicons
                  name="chevron-back"
                  size={24}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>

              <View style={styles.timeTextContainer}>
                <Text
                  style={[styles.timeText, { color: colors.primary }]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.7}
                >
                  {formatExtendedTimeSince(
                    event.startDate,
                    previewUnit || event.showTimeAs
                  )}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.arrowButton}
                onPress={handleNextUnit}
                accessibilityRole="button"
                accessibilityLabel="Next time unit"
                activeOpacity={0.7}
              >
                <Ionicons
                  name="chevron-forward"
                  size={24}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            {/* TODO: Replace hardcoded section titles and labels with i18n translations */}
            <Text
              style={[styles.sectionTitle, { color: colors.textSecondary }]}
            >
              Details
            </Text>
            <Text style={[styles.title, { color: colors.text }]}>
              {event.title}
            </Text>
            {event.description && (
              <Text
                style={[styles.description, { color: colors.textSecondary }]}
              >
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

          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <View style={styles.sectionHeader}>
              <Text
                style={[styles.sectionTitle, { color: colors.textSecondary }]}
              >
                Reminders
              </Text>
              <Ionicons
                name="notifications"
                size={18}
                color={colors.textSecondary}
              />
            </View>
            {eventReminders.length === 0 ? (
              <Text style={[styles.emptyText, { color: colors.textTertiary }]}>
                No reminders set
              </Text>
            ) : (
              <View style={styles.remindersList}>
                {eventReminders.map((reminder) => (
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
                          name={
                            reminder.type === "recurring" ? "repeat" : "time"
                          }
                          size={20}
                          color={colors.primary}
                        />
                        <Text
                          style={[styles.reminderType, { color: colors.text }]}
                        >
                          {reminder.type === "recurring"
                            ? "Recurring"
                            : "One-time"}
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

          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <View style={styles.sectionHeader}>
              <Text
                style={[styles.sectionTitle, { color: colors.textSecondary }]}
              >
                Milestones
              </Text>
              <Ionicons name="trophy" size={18} color={colors.textSecondary} />
            </View>
            {eventMilestones.length === 0 ? (
              <Text style={[styles.emptyText, { color: colors.textTertiary }]}>
                No milestones yet
              </Text>
            ) : (
              <>
                <View style={styles.milestonesList}>
                  {(showAllMilestones
                    ? eventMilestones
                    : eventMilestones.slice(0, 5)
                  ).map((milestone) => {
                    const reached =
                      milestone.reachedAt !== null ||
                      (event &&
                        isMilestoneReached(
                          {
                            label: milestone.label,
                            targetAmount: milestone.targetAmount,
                            targetUnit: milestone.targetUnit,
                            isPredefined: true,
                          },
                          event.startDate
                        ));
                    return (
                      <View
                        key={milestone.id}
                        style={[
                          styles.milestoneItem,
                          {
                            backgroundColor: reached
                              ? colors.primary + "15"
                              : colors.background,
                            borderLeftColor: reached
                              ? colors.primary
                              : colors.border,
                          },
                        ]}
                      >
                        <View style={styles.milestoneContent}>
                          <View style={styles.milestoneHeader}>
                            <Text
                              style={[
                                styles.milestoneLabel,
                                { color: colors.text },
                              ]}
                            >
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
                            {milestone.reachedAt && (
                              <Text style={{ color: colors.primary }}>
                                {" "}
                                • Reached{" "}
                                {milestone.reachedAt.toLocaleDateString()}
                              </Text>
                            )}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
                {eventMilestones.length > 5 && (
                  <TouchableOpacity
                    onPress={() => setShowAllMilestones(!showAllMilestones)}
                    style={styles.showMoreButton}
                    accessibilityRole="button"
                    accessibilityLabel={
                      showAllMilestones ? "Show fewer milestones" : "Show all milestones"
                    }
                  >
                    <Text
                      style={[
                        styles.showMoreText,
                        { color: colors.primary },
                      ]}
                    >
                      {showAllMilestones ? "Show Less" : `Show All (${eventMilestones.length})`}
                    </Text>
                    <Ionicons
                      name={showAllMilestones ? "chevron-up" : "chevron-down"}
                      size={18}
                      color={colors.primary}
                    />
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
  },
  timeDisplay: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timeDisplayRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  arrowButton: {
    padding: 8,
    minWidth: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  timeTextContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  timeText: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
  },
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
  placeholderText: {
    fontSize: 14,
    fontStyle: "italic",
  },
  headerButtons: {
    flexDirection: "row",
  },
  headerButton: {
    marginLeft: 16,
  },
  headerButtonText: {
    fontSize: 16,
  },
});
