import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { EventDetailScreen } from "@/app/EventDetailScreen";
import { EditEventScreen } from "@/app/EditEventScreen";
import { TabNavigator } from "./TabNavigator";
import { getThemeColors, useTheme } from "@/theme/index";
import type { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Main stack navigator component that provides navigation between screens.
 * Includes the tab navigator and the event detail/edit screens.
 * Supports both light and dark themes.
 */
export const AppNavigator: React.FC = () => {
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="MainTabs"
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.surface,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            // TODO: Make header font weight configurable via theme (currently hardcoded to "600")
            fontWeight: "600",
          },
        }}
      >
        <Stack.Screen
          name="MainTabs"
          component={TabNavigator}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="EventDetail"
          component={EventDetailScreen}
          options={() => ({
            headerShown: true,
            headerStyle: {
              backgroundColor: colors.surface,
            },
            headerTintColor: colors.text,
            headerTitleStyle: {
              fontWeight: "600",
            },
            // TODO: Replace hardcoded title with i18n translations or dynamic title from event
            title: "Event Details",
            headerBackTitle: "Home",
          })}
        />
        <Stack.Screen
          name="EditEvent"
          component={EditEventScreen}
          options={{
            headerShown: true,
            headerStyle: {
              backgroundColor: colors.surface,
            },
            headerTintColor: colors.text,
            headerTitleStyle: {
              fontWeight: "600",
            },
            // TODO: Replace hardcoded title with i18n translations (will be dynamic based on edit/create)
            title: "Edit Event",
            headerBackTitle: "Home",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
