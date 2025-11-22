/**
 * Version utility functions for reading app version from package.json
 */

/**
 * Gets the app version from package.json.
 * Falls back to app.json (Expo standard) or '1.0.0' if files cannot be read.
 * Metro bundler resolves these at bundle time.
 * @returns The app version string, always returns a valid string
 */
export const getAppVersion = (): string => {
  try {
    // Try package.json first (path from src/utils/version.ts to root: ../../package.json)
    const packageJson = require('../../package.json');
    if (packageJson?.version) {
      return packageJson.version;
    }
  } catch (error) {
    // Fall through to try app.json
  }

  try {
    // Fallback to app.json (Expo standard, same relative path)
    const appJson = require('../../app.json');
    if (appJson?.expo?.version) {
      return appJson.expo.version;
    }
  } catch (error) {
    console.warn('Could not read package.json or app.json version, using fallback:', error);
  }

  return '1.0.0';
};

/**
 * Gets the app version with build metadata.
 * Currently proxies getAppVersion, but can be extended with build numbers later.
 * @returns The app version string with optional build metadata
 */
export const getAppVersionWithBuild = (): string => {
  return getAppVersion();
};

