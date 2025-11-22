import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEventsStore } from '@/features/events/eventsStore';
import { EventCard } from '@/components/EventCard';
import { colors } from '@/theme';
import type { Event } from '@/features/events/types';
import type { RootStackParamList } from '@/navigation/types';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

/**
 * Home screen displaying list of all events
 */
export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { events, isLoading, loadEvents } = useEventsStore();
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // Refresh time display periodically (every minute)
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey((prev) => prev + 1);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleAddEvent = () => {
    navigation.navigate('EditEvent', {});
  };

  const handleEventPress = (eventId: string) => {
    navigation.navigate('EventDetail', { eventId });
  };

  const renderEvent = ({ item }: { item: Event }) => (
    <EventCard event={item} onPress={() => handleEventPress(item.id)} />
  );

  if (isLoading && events.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        renderItem={renderEvent}
        keyExtractor={(item) => `${item.id}-${refreshKey}`}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No events yet</Text>
            <Text style={styles.emptySubtext}>Tap the + button to add your first event</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={handleAddEvent}
        accessibilityRole="button"
        accessibilityLabel="Add new event"
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  listContent: {
    paddingVertical: 8,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.secondary,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.text.tertiary,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.shadow.default,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  fabText: {
    fontSize: 32,
    color: colors.text.inverse,
    fontWeight: '300',
  },
});

