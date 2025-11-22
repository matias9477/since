import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { AppNavigator } from "@/navigation/AppNavigator";
import { initializeDatabase } from "@/db/client";
import { configureNotifications } from "./src/utils/notifications";
import { useTheme } from "@/theme/index";

/**
 * Main App component
 * Initializes the database and renders the navigation stack
 */
export default function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const { colors, isDarkMode } = useTheme();

  useEffect(() => {
    const init = async () => {
      try {
        await initializeDatabase();
        await configureNotifications();
        setIsInitialized(true);
      } catch (error) {
        // TODO: Replace hardcoded error message with i18n translations or user-friendly error handling
        console.error("Failed to initialize app:", error);
        // Still show the app even if initialization fails
        setIsInitialized(true);
      }
    };

    init();
  }, []);

  if (!isInitialized) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
        {/* TODO: Replace hardcoded StatusBar style with theme-based setting */}
        <StatusBar style={isDarkMode ? "light" : "dark"} />
      </View>
    );
  }

  return (
    <>
      <AppNavigator />
      {/* TODO: Replace hardcoded StatusBar style with theme-based setting */}
      <StatusBar style={isDarkMode ? "light" : "dark"} />
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
