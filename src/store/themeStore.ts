import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ThemeMode = "system" | "light" | "dark";

export interface ThemeState {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
}

/**
 * Theme store for managing app appearance and preferences.
 * Handles theme mode (system/light/dark) with persistence.
 */
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      themeMode: "system",
      setThemeMode: (mode: ThemeMode) => {
        set({ themeMode: mode });
      },
    }),
    {
      name: "theme-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
