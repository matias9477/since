import React from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useTheme } from "@/theme";

interface DateTimePickerProps {
  isVisible: boolean;
  date: Date;
  onConfirm: (date: Date) => void;
  onCancel: () => void;
  mode?: "date" | "time" | "datetime";
  maximumDate?: Date;
  minimumDate?: Date;
  display?: "default" | "spinner" | "calendar" | "compact" | "inline";
}

/**
 * Custom DateTimePicker component that automatically handles theming
 * Wraps react-native-modal-datetime-picker with consistent dark/light mode styling
 */
export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  isVisible,
  date,
  onConfirm,
  onCancel,
  mode = "datetime",
  maximumDate,
  minimumDate,
  display = "spinner",
}) => {
  const { colors, isDarkMode } = useTheme();

  // Use en_GB locale for time mode to enable 24-hour format
  const locale = mode === "time" ? "en_GB" : "en_US";

  // For time mode, completely exclude date constraints to prevent any issues
  // Don't pass maximumDate or minimumDate props at all for time mode
  if (mode === "time") {
    return (
      <DateTimePickerModal
        isVisible={isVisible}
        mode="time"
        date={date}
        onConfirm={onConfirm}
        onCancel={onCancel}
        display={display}
        themeVariant={isDarkMode ? "dark" : "light"}
        accentColor={colors.primary}
        isDarkModeEnabled={isDarkMode}
        buttonTextColorIOS={isDarkMode ? "#FFFFFF" : "#000000"}
        locale={locale}
      />
    );
  }

  // For date/datetime modes, apply constraints as needed
  return (
    <DateTimePickerModal
      isVisible={isVisible}
      mode={mode}
      date={date}
      onConfirm={onConfirm}
      onCancel={onCancel}
      {...(maximumDate && { maximumDate })}
      {...(minimumDate && { minimumDate })}
      display={display}
      themeVariant={isDarkMode ? "dark" : "light"}
      accentColor={colors.primary}
      isDarkModeEnabled={isDarkMode}
      buttonTextColorIOS={isDarkMode ? "#FFFFFF" : "#000000"}
      locale={locale}
    />
  );
};

