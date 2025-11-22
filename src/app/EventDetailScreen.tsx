import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEventsStore } from '@/features/events/eventsStore';
import { TimeSinceLabel } from '@/components/TimeSinceLabel';
import { colors } from '@/theme';
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
  const [refreshKey, setRefreshKey] = useState(0);

  const event = getEventById(eventId);

  useEffect(() => {
    if (!event) {
      loadEvents();
    }
  }, [event, loadEvents]);

  // Refresh time display periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey((prev) => prev + 1);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
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
            <Text style={styles.headerButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, event]);

  const handleEdit = () => {
    navigation.navigate('EditEvent', { eventId });
  };

  const handleDelete = () => {
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
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Event not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} key={refreshKey}>
      <View style={styles.content}>
        <View style={styles.timeDisplay}>
          <TimeSinceLabel
            startDate={event.startDate}
            unit={event.showTimeAs}
            style={styles.timeText}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>
          <Text style={styles.title}>{event.title}</Text>
          {event.description && (
            <Text style={styles.description}>{event.description}</Text>
          )}
          <Text style={styles.metaText}>
            Started: {event.startDate.toLocaleDateString()}
          </Text>
          <Text style={styles.metaText}>
            Displaying as: {event.showTimeAs}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Milestones</Text>
          <Text style={styles.placeholderText}>
            Milestones feature coming soon
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reminders</Text>
          <Text style={styles.placeholderText}>
            Reminders feature coming soon
          </Text>
        </View>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
          accessibilityRole="button"
          accessibilityLabel="Delete event"
        >
          <Text style={styles.deleteButtonText}>Delete Event</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
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
    color: colors.text.tertiary,
  },
  timeDisplay: {
    backgroundColor: colors.background.primary,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: colors.shadow.default,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timeText: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary,
  },
  section: {
    backgroundColor: colors.background.primary,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.secondary,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: 12,
  },
  metaText: {
    fontSize: 14,
    color: colors.text.tertiary,
    marginTop: 4,
  },
  placeholderText: {
    fontSize: 14,
    color: colors.text.tertiary,
    fontStyle: 'italic',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    marginLeft: 16,
  },
  headerButtonText: {
    color: colors.primary,
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: colors.error,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  deleteButtonText: {
    color: colors.text.inverse,
    fontSize: 16,
    fontWeight: '600',
  },
});

