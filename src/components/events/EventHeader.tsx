import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
} from "date-fns";
import { formatTimeSince } from "@/lib/formatTimeSince";
import { useTheme } from "@/theme/index";
import type { TimeUnit } from "@/config/types";

/**
 * Extended time unit type for frontend-only units (hours, minutes, seconds)
 * These are not stored in the backend but can be displayed in the details screen
 */
type ExtendedTimeUnit = TimeUnit | "hours" | "minutes" | "seconds";

/**
 * All available time units in order from largest to smallest
 */
const ALL_TIME_UNITS: ExtendedTimeUnit[] = [
  "years",
  "months",
  "weeks",
  "days",
  "hours",
  "minutes",
  "seconds",
];

/**
 * Formats time for extended units (including hours, minutes, seconds)
 * For hours, minutes, and seconds, shows only the total count (no compound units)
 * Falls back to formatTimeSince for standard units
 */
const formatExtendedTimeSince = (
  startDate: Date,
  unit: ExtendedTimeUnit
): string => {
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

interface EventHeaderProps {
  /**
   * The start date of the event
   */
  startDate: Date;
  /**
   * The base time unit for the event (e.g., "days")
   */
  showTimeAs: TimeUnit;
}

/**
 * Header component displaying the time since an event started
 * Allows users to cycle through different time units (days, hours, minutes, seconds)
 */
export const EventHeader: React.FC<EventHeaderProps> = ({
  startDate,
  showTimeAs,
}) => {
  const { colors } = useTheme();
  const [previewUnit, setPreviewUnit] = useState<ExtendedTimeUnit | null>(
    null
  );
  const [refreshKey, setRefreshKey] = useState(0);

  // Initialize preview unit with event's actual unit when component mounts
  useEffect(() => {
    if (previewUnit === null) {
      setPreviewUnit(showTimeAs);
    }
  }, [showTimeAs, previewUnit]);

  /**
   * Gets the allowed time units for cycling based on the event's original unit
   * Only allows cycling to smaller or equal units (including hours, minutes, seconds)
   */
  const getAllowedUnits = (): ExtendedTimeUnit[] => {
    const originalIndex = ALL_TIME_UNITS.indexOf(showTimeAs);
    // Return all units from the original unit down to seconds (inclusive)
    return ALL_TIME_UNITS.slice(originalIndex);
  };

  /**
   * Cycles to the next time unit (only within allowed units)
   */
  const handleNextUnit = () => {
    const allowedUnits = getAllowedUnits();
    const currentUnit = previewUnit || showTimeAs;
    const currentIndex = allowedUnits.indexOf(currentUnit);
    const nextIndex = (currentIndex + 1) % allowedUnits.length;
    setPreviewUnit(allowedUnits[nextIndex]);
  };

  /**
   * Cycles to the previous time unit (only within allowed units)
   */
  const handlePreviousUnit = () => {
    const allowedUnits = getAllowedUnits();
    const currentUnit = previewUnit || showTimeAs;
    const currentIndex = allowedUnits.indexOf(currentUnit);
    const prevIndex =
      (currentIndex - 1 + allowedUnits.length) % allowedUnits.length;
    setPreviewUnit(allowedUnits[prevIndex]);
  };

  // Refresh time display periodically
  // For seconds: update every second
  // For minutes: update every minute (60000ms)
  // For other units: update every minute
  useEffect(() => {
    const currentUnit = previewUnit || showTimeAs;
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
  }, [previewUnit, showTimeAs]);

  return (
    <View
      style={[
        styles.timeDisplay,
        { backgroundColor: colors.surface, shadowColor: colors.shadow },
      ]}
      key={refreshKey}
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
            {formatExtendedTimeSince(startDate, previewUnit || showTimeAs)}
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
  );
};

const styles = StyleSheet.create({
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
});

