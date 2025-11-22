import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { AppNavigator } from "@/navigation/AppNavigator";
import { initializeDatabase } from "@/db/client";
import { colors } from "@/theme/index";

/**
 * Main App component
 * Initializes the database and renders the navigation stack
 */
export default function App() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await initializeDatabase();
        setIsInitialized(true);
      } catch (error) {
        console.error("Failed to initialize database:", error);
        // Still show the app even if DB init fails
        setIsInitialized(true);
      }
    };

    init();
  }, []);

  if (!isInitialized) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <StatusBar style="auto" />
      </View>
    );
  }

  return (
    <>
      <AppNavigator />
      <StatusBar style="auto" />
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background.primary,
  },
});
