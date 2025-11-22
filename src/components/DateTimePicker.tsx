import React from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useTheme } from "../theme";

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

  // Don't apply date constraints to time picker
  const shouldApplyDateConstraints = mode !== "time";

  return (
    <DateTimePickerModal
      isVisible={isVisible}
      mode={mode}
      date={date}
      onConfirm={onConfirm}
      onCancel={onCancel}
      {...(shouldApplyDateConstraints && maximumDate && { maximumDate })}
      {...(shouldApplyDateConstraints && minimumDate && { minimumDate })}
      display={display}
      themeVariant={isDarkMode ? "dark" : "light"}
      accentColor={colors.primary}
      isDarkModeEnabled={isDarkMode}
      buttonTextColorIOS={isDarkMode ? "#FFFFFF" : "#000000"}
      locale={locale}
    />
  );
};
