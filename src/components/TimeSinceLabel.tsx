import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { formatTimeSince } from '@/lib/formatTimeSince';
import { useTheme } from '@/theme';
import type { TimeUnit } from '@/config/types';

interface TimeSinceLabelProps {
  startDate: Date;
  unit: TimeUnit;
  style?: object;
}

/**
 * Component that displays formatted "time since" text
 */
export const TimeSinceLabel: React.FC<TimeSinceLabelProps> = ({
  startDate,
  unit,
  style,
}) => {
  const { colors } = useTheme();
  const formatted = formatTimeSince(startDate, unit);
  return <Text style={[styles.text, { color: colors.text }, style]}>{formatted}</Text>;
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
  },
});

