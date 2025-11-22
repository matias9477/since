import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TimeSinceLabel } from './TimeSinceLabel';
import { colors } from '@/theme';
import type { Event } from '@/features/events/types';

interface EventCardProps {
  event: Event;
  onPress: () => void;
}

/**
 * Card component for displaying an event in a list
 */
export const EventCard: React.FC<EventCardProps> = ({ event, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.card, event.isPinned && styles.pinnedCard]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Event: ${event.title}`}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {event.title}
          </Text>
          {event.isPinned && <Text style={styles.pinBadge}>📌</Text>}
        </View>
        {event.description && (
          <Text style={styles.description} numberOfLines={2}>
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
    backgroundColor: colors.background.primary,
    borderRadius: 8,
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 16,
    shadowColor: colors.shadow.default,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pinnedCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
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
    color: colors.text.primary,
    flex: 1,
  },
  pinBadge: {
    fontSize: 16,
    marginLeft: 8,
  },
  description: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  footer: {
    marginTop: 4,
  },
});

