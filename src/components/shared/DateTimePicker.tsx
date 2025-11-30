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

  // Don't apply date constraints to time picker
  // For time mode, explicitly exclude maximumDate and minimumDate to prevent any constraint issues
  const pickerProps =
    mode === "time"
      ? {
          isVisible,
          mode,
          date,
          onConfirm,
          onCancel,
          display,
          themeVariant: isDarkMode ? "dark" : "light",
          accentColor: colors.primary,
          isDarkModeEnabled: isDarkMode,
          buttonTextColorIOS: isDarkMode ? "#FFFFFF" : "#000000",
          locale,
        }
      : {
          isVisible,
          mode,
          date,
          onConfirm,
          onCancel,
          ...(maximumDate && { maximumDate }),
          ...(minimumDate && { minimumDate }),
          display,
          themeVariant: isDarkMode ? "dark" : "light",
          accentColor: colors.primary,
          isDarkModeEnabled: isDarkMode,
          buttonTextColorIOS: isDarkMode ? "#FFFFFF" : "#000000",
          locale,
        };

  return <DateTimePickerModal {...pickerProps} />;
};

