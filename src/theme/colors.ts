/**
 * Color palette for the app
 * All colors used throughout the app should come from here
 */

export const colors = {
  // Primary colors
  primary: '#007AFF',
  primaryDark: '#0051D5',
  primaryLight: '#5AC8FA',

  // Semantic colors
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  info: '#007AFF',

  // Neutral colors
  white: '#FFFFFF',
  black: '#000000',
  gray: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },

  // Text colors
  text: {
    primary: '#000000',
    secondary: '#666666',
    tertiary: '#999999',
    inverse: '#FFFFFF',
    disabled: '#CCCCCC',
  },

  // Background colors
  background: {
    primary: '#FFFFFF',
    secondary: '#F5F5F5',
    tertiary: '#EEEEEE',
  },

  // Border colors
  border: {
    light: '#E0E0E0',
    default: '#DDDDDD',
    dark: '#CCCCCC',
  },

  // Shadow colors
  shadow: {
    default: '#000000',
  },
} as const;

/**
 * Type for color keys (for type safety)
 */
export type ColorKey = keyof typeof colors;

