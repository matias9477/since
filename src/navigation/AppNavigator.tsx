import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen } from "@/app/HomeScreen";
import { EventDetailScreen } from "@/app/EventDetailScreen";
import { EditEventScreen } from "@/app/EditEventScreen";
import { SettingsScreen } from "@/app/SettingsScreen";
import { colors } from "@/theme/index";
import type { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Main app navigator with stack navigation
 */
export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background.primary,
          },
          headerTintColor: colors.text.primary,
          headerTitleStyle: {
            fontWeight: "600",
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: "Since",
            headerRight: () => null,
          }}
        />
        <Stack.Screen name="EventDetail" component={EventDetailScreen} />
        <Stack.Screen name="EditEvent" component={EditEventScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
