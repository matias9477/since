import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TimeSinceLabel } from './TimeSinceLabel';
import { useTheme } from '@/theme';
import type { Event } from '@/features/events/types';

interface EventCardProps {
  event: Event;
  onPress: () => void;
}

/**
 * Card component for displaying an event in a list
 */
export const EventCard: React.FC<EventCardProps> = ({ event, onPress }) => {
  const { colors } = useTheme();
  
  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: colors.surface, shadowColor: colors.shadow },
        event.isPinned && styles.pinnedCard,
        event.isPinned && { borderLeftColor: colors.primary },
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Event: ${event.title}`}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
            {event.title}
          </Text>
          {/* TODO: Replace hardcoded emoji with icon from theme/icons library */}
          {event.isPinned && <Text style={styles.pinBadge}>📌</Text>}
        </View>
        {event.description && (
          <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>
            {event.description}
          </Text>
        )}
        <View style={styles.footer}>
          <TimeSinceLabel startDate={event.startDate} unit={event.showTimeAs} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pinnedCard: {
    borderLeftWidth: 4,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  pinBadge: {
    fontSize: 16,
    marginLeft: 8,
  },
  description: {
    fontSize: 14,
    marginBottom: 8,
  },
  footer: {
    marginTop: 4,
  },
});

