import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEventsStore } from '@/features/events/eventsStore';
import { EventCard } from '@/components/EventCard';
import { useTheme } from '@/theme';
import type { Event } from '@/features/events/types';
import type { RootStackParamList, TabParamList } from '@/navigation/types';
import {
  sortEvents,
  getSortOptionLabel,
  type SortOption,
} from '@/utils/sorting';

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
  const [sortOption, setSortOption] = useState<SortOption>('dateDescending');
  const [showSortModal, setShowSortModal] = useState(false);

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

  /**
   * Sorted events based on the selected sort option
   */
  const sortedEvents = useMemo(() => {
    return sortEvents(events, sortOption);
  }, [events, sortOption]);

  /**
   * Handles sort option selection
   */
  const handleSortOptionSelect = (option: SortOption) => {
    setSortOption(option);
    setShowSortModal(false);
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
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Events</Text>
        <TouchableOpacity
          style={[styles.sortButton, { backgroundColor: colors.surface }]}
          onPress={() => setShowSortModal(true)}
          accessibilityRole="button"
          accessibilityLabel="Sort events"
          activeOpacity={0.7}
        >
          <Ionicons name="swap-vertical-outline" size={20} color={colors.text} />
          <Text style={[styles.sortButtonText, { color: colors.textSecondary }]}>
            {getSortOptionLabel(sortOption)}
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={sortedEvents}
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

      {/* Sort Options Modal */}
      <Modal
        visible={showSortModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSortModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowSortModal(false)}
        >
          <View
            style={[styles.modalContent, { backgroundColor: colors.surface }]}
            onStartShouldSetResponder={() => true}
          >
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Sort By</Text>
              <TouchableOpacity
                onPress={() => setShowSortModal(false)}
                accessibilityRole="button"
                accessibilityLabel="Close sort options"
              >
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalOptions}>
              {(['alphabetical', 'dateAscending', 'dateDescending'] as SortOption[]).map(
                (option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.sortOption,
                      sortOption === option && {
                        backgroundColor: colors.primary + '20',
                      },
                    ]}
                    onPress={() => handleSortOptionSelect(option)}
                    accessibilityRole="button"
                    accessibilityLabel={`Sort by ${getSortOptionLabel(option)}`}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.sortOptionText,
                        { color: sortOption === option ? colors.primary : colors.text },
                      ]}
                    >
                      {getSortOptionLabel(option)}
                    </Text>
                    {sortOption === option && (
                      <Ionicons name="checkmark" size={20} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                )
              )}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: '500',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 12,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  modalOptions: {
    padding: 8,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 8,
    marginVertical: 4,
  },
  sortOptionText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

