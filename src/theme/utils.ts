import { useColorScheme } from "react-native";
import { useThemeStore } from "@/store/themeStore";
import { colors } from "./colors";

/**
 * Theme colors interface matching the structure used throughout the app
 */
export interface ThemeColors {
  // Background colors
  background: string;
  surface: string;
  surfaceVariant: string;
  // Text colors
  text: string;
  textSecondary: string;
  textTertiary: string;
  // Primary colors
  primary: string;
  primaryLight: string;
  primaryDark: string;
  // Status colors
  success: string;
  error: string;
  warning: string;
  info: string;
  danger: string;
  // UI colors
  border: string;
  divider: string;
  shadow: string;
  // Switch colors
  switchTrack: string;
  switchThumb: string;
  switchThumbDisabled: string;
  // Loading color
  loading: string;
}

/**
 * Get theme colors based on the current theme mode.
 * Supports light and dark themes with comprehensive color palette.
 */
export const getThemeColors = (isDarkMode: boolean): ThemeColors => {
  if (isDarkMode) {
    return {
      // Background colors
      background: "#121212",
      surface: "#1E1E1E",
      surfaceVariant: "#2D2D2D",
      // Text colors
      text: "#FFFFFF",
      textSecondary: "#B3B3B3",
      textTertiary: "#808080",
      // Primary colors - Changed from green to yellow
      primary: colors.baseYellow,
      primaryLight: "#fdcb2a",
      primaryDark: "#e6a800",
      // Status colors - Changed success from green to yellow
      success: colors.baseYellow,
      error: "#F44336",
      warning: "#FF9800",
      info: "#2196F3",
      danger: "#DC143C",
      // UI colors
      border: "#333333",
      divider: "#404040",
      shadow: "#000000",
      // Switch colors
      switchTrack: "#404040",
      switchThumb: "#FFFFFF",
      switchThumbDisabled: "#666666",
      // Loading color - Changed from green to yellow
      loading: colors.baseYellow,
    };
  } else {
    return {
      // Background colors
      background: "#F5F5F5",
      surface: "#FFFFFF",
      surfaceVariant: "#F8F8F8",
      // Text colors
      text: "#000000",
      textSecondary: "#666666",
      textTertiary: "#999999",
      // Primary colors - Changed from green to yellow
      primary: colors.baseYellow,
      primaryLight: "#fef4d6",
      primaryDark: "#e6a800",
      // Status colors - Changed success from green to yellow
      success: colors.baseYellow,
      error: "#F44336",
      warning: "#FF9800",
      info: "#2196F3",
      danger: "#f44336",
      // UI colors
      border: "#E0E0E0",
      divider: "#F0F0F0",
      shadow: "#000000",
      // Switch colors
      switchTrack: "#E0E0E0",
      switchThumb: "#FFFFFF",
      switchThumbDisabled: "#CCCCCC",
      // Loading color - Changed from green to yellow
      loading: colors.baseYellow,
    };
  }
};

/**
 * Hook to get the current theme mode and determine if dark mode should be used.
 * Takes into account the user's preference and system setting.
 * useColorScheme() automatically detects OS theme and updates on changes.
 */
export const useTheme = () => {
  const { themeMode } = useThemeStore();
  const systemColorScheme = useColorScheme(); // Detects OS theme

  // When themeMode is 'system', follow the OS
  const isDarkMode =
    themeMode === "dark" ||
    (themeMode === "system" && systemColorScheme === "dark");

  return {
    themeMode,
    isDarkMode,
    systemColorScheme, // 'light' | 'dark' | null
    colors: getThemeColors(isDarkMode),
  };
};
