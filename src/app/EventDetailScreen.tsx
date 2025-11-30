import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEventsStore } from "@/features/events/eventsStore";
import { useMilestonesStore } from "@/features/milestones/milestonesStore";
import { useRemindersStore } from "@/features/reminders/remindersStore";
import { EventHeader } from "@/components/events/EventHeader";
import { EventDetailsSection } from "@/components/events/EventDetailsSection";
import { EventRemindersSection } from "@/components/events/EventRemindersSection";
import { EventMilestonesSection } from "@/components/events/EventMilestonesSection";
import { useTheme } from "@/theme/index";
import type { RootStackParamList } from "@/navigation/types";

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
  const { loadMilestones, getMilestonesByEventId } = useMilestonesStore();
  const { loadReminders, getRemindersByEventId } = useRemindersStore();
  const { colors } = useTheme();

  const event = getEventById(eventId);
  const eventMilestones = getMilestonesByEventId(eventId);
  const eventReminders = getRemindersByEventId(eventId);

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
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <EventHeader
            startDate={event.startDate}
            showTimeAs={event.showTimeAs}
          />

          <EventDetailsSection event={event} />

          <EventRemindersSection reminders={eventReminders} />

          <EventMilestonesSection milestones={eventMilestones} event={event} />
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
  headerButtons: {
    flexDirection: "row",
  },
  headerButton: {
    marginLeft: 16,
  },
  headerButtonText: {
    fontSize: 16,
    paddingRight: 12,
  },
});
