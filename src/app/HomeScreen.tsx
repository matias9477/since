import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEventsStore } from '@/features/events/eventsStore';
import { EventCard } from '@/components/EventCard';
import { useTheme } from '@/theme';
import type { Event } from '@/features/events/types';
import type { RootStackParamList, TabParamList } from '@/navigation/types';

// Home is in a tab navigator, but can navigate to stack screens
type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'Home'>,
  NativeStackNavigationProp<RootStackParamList>
>;

/**
 * Home screen displaying list of all events
 */
export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { events, isLoading, loadEvents } = useEventsStore();
  const { colors } = useTheme();
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // Refresh time display periodically (every minute)
  useEffect(() => {
    // TODO: Make refresh interval configurable via settings (currently hardcoded to 60000ms = 1 minute)
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
      <SafeAreaView style={[styles.container, styles.centerContainer]} edges={['top']}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <FlatList
        data={events}
        renderItem={renderEvent}
        keyExtractor={(item) => `${item.id}-${refreshKey}`}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            {/* TODO: Replace hardcoded empty state messages with i18n translations */}
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No events yet</Text>
            <Text style={[styles.emptySubtext, { color: colors.textTertiary }]}>Tap the + button to add your first event</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary, shadowColor: colors.shadow }]}
        onPress={handleAddEvent}
        accessibilityRole="button"
        accessibilityLabel="Add new event"
      >
        {/* TODO: Consider replacing hardcoded "+" with icon from theme/icons library */}
        <Text style={[styles.fabText, { color: '#FFFFFF' }]}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  fabText: {
    fontSize: 32,
    fontWeight: '300',
  },
});

