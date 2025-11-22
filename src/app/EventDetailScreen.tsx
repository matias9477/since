import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEventsStore } from '@/features/events/eventsStore';
import { TimeSinceLabel } from '@/components/TimeSinceLabel';
import { useTheme } from '@/theme';
import type { RootStackParamList } from '@/navigation/types';

type EventDetailScreenRouteProp = RouteProp<RootStackParamList, 'EventDetail'>;
type EventDetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'EventDetail'>;

/**
 * Screen displaying detailed information about an event
 */
export const EventDetailScreen: React.FC = () => {
  const navigation = useNavigation<EventDetailScreenNavigationProp>();
  const route = useRoute<EventDetailScreenRouteProp>();
  const { eventId } = route.params;
  const { getEventById, deleteEvent, loadEvents } = useEventsStore();
  const { colors } = useTheme();
  const [refreshKey, setRefreshKey] = useState(0);

  const event = getEventById(eventId);

  useEffect(() => {
    if (!event) {
      loadEvents();
    }
  }, [event, loadEvents]);

  // Refresh time display periodically
  useEffect(() => {
    // TODO: Make refresh interval configurable via settings (currently hardcoded to 60000ms = 1 minute)
    const interval = setInterval(() => {
      setRefreshKey((prev) => prev + 1);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // TODO: Replace hardcoded strings with i18n translations
    navigation.setOptions({
      title: event?.title || 'Event Details',
      headerRight: () => (
        <View style={styles.headerButtons}>
          <TouchableOpacity
            onPress={handleEdit}
            style={styles.headerButton}
            accessibilityRole="button"
            accessibilityLabel="Edit event"
          >
            <Text style={[styles.headerButtonText, { color: colors.primary }]}>Edit</Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, event]);

  const handleEdit = () => {
    navigation.navigate('EditEvent', { eventId });
  };

  const handleDelete = () => {
    // TODO: Replace hardcoded alert strings with i18n translations
    Alert.alert(
      'Delete Event',
      'Are you sure you want to delete this event?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const success = await deleteEvent(eventId);
            if (success) {
              navigation.goBack();
            } else {
              Alert.alert('Error', 'Failed to delete event');
            }
          },
        },
      ]
    );
  };

  if (!event) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContainer, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
        {/* TODO: Replace hardcoded error message with i18n translations */}
        <Text style={[styles.errorText, { color: colors.textTertiary }]}>Event not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <ScrollView style={styles.scrollView} key={refreshKey}>
      <View style={styles.content}>
        <View style={[styles.timeDisplay, { backgroundColor: colors.surface, shadowColor: colors.shadow }]}>
          <TimeSinceLabel
            startDate={event.startDate}
            unit={event.showTimeAs}
            style={[styles.timeText, { color: colors.primary }]}
          />
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          {/* TODO: Replace hardcoded section titles and labels with i18n translations */}
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Details</Text>
          <Text style={[styles.title, { color: colors.text }]}>{event.title}</Text>
          {event.description && (
            <Text style={[styles.description, { color: colors.textSecondary }]}>{event.description}</Text>
          )}
          <Text style={[styles.metaText, { color: colors.textTertiary }]}>
            Started: {/* TODO: Replace hardcoded toLocaleDateString() with locale from user settings */}
            {event.startDate.toLocaleDateString()}
          </Text>
          <Text style={[styles.metaText, { color: colors.textTertiary }]}>
            Displaying as: {event.showTimeAs}
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          {/* TODO: Implement milestones feature - currently placeholder */}
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Milestones</Text>
          <Text style={[styles.placeholderText, { color: colors.textTertiary }]}>
            Milestones feature coming soon
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          {/* TODO: Implement reminders feature - currently placeholder */}
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Reminders</Text>
          <Text style={[styles.placeholderText, { color: colors.textTertiary }]}>
            Reminders feature coming soon
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.deleteButton, { backgroundColor: colors.error }]}
          onPress={handleDelete}
          accessibilityRole="button"
          accessibilityLabel="Delete event"
        >
          {/* TODO: Replace hardcoded button text with i18n translations */}
          <Text style={styles.deleteButtonText}>Delete Event</Text>
        </TouchableOpacity>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
  },
  timeDisplay: {
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timeText: {
    fontSize: 32,
    fontWeight: '700',
  },
  section: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
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
    fontStyle: 'italic',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    marginLeft: 16,
  },
  headerButtonText: {
    fontSize: 16,
  },
  deleteButton: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

