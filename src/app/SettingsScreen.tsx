import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme';
import { useThemeStore } from '@/store/themeStore';
import { getAppVersion } from '@/utils/version';
import { PrivacyPolicyModal } from '@/components/PrivacyPolicyModal';
import { TermsOfServiceModal } from '@/components/TermsOfServiceModal';

/**
 * Settings screen for app configuration
 */
export const SettingsScreen: React.FC = () => {
  const { colors, themeMode } = useTheme();
  const { setThemeMode } = useThemeStore();
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTermsOfService, setShowTermsOfService] = useState(false);

  /**
   * Handles theme mode toggle, cycling through: system → light → dark → system
   */
  const handleToggleDarkMode = () => {
    const nextMode =
      themeMode === 'system'
        ? 'light'
        : themeMode === 'light'
          ? 'dark'
          : 'system';
    setThemeMode(nextMode);
  };

  /**
   * Gets the display text for the current theme mode
   */
  const getThemeModeText = () => {
    if (themeMode === 'system') {
      return 'Follow system setting';
    }
    if (themeMode === 'light') {
      return 'Light mode';
    }
    return 'Dark mode';
  };

  /**
   * Renders a setting item with icon, label, value, and optional onPress handler.
   * If onPress is not provided, the item is read-only and displays without a chevron.
   */
  const renderSettingItem = (
    label: string,
    value: string,
    iconName: keyof typeof Ionicons.glyphMap,
    onPress?: () => void
  ) => {
    const content = (
      <>
        <View style={styles.settingItemLeft}>
          <Ionicons name={iconName} size={24} color={colors.primary} />
          <View style={styles.settingItemText}>
            <Text style={[styles.settingItemLabel, { color: colors.text }]}>
              {label}
            </Text>
            <Text style={[styles.settingItemValue, { color: colors.textSecondary }]}>
              {value}
            </Text>
          </View>
        </View>
        {onPress && (
          <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
        )}
      </>
    );

    if (onPress) {
      return (
        <TouchableOpacity
          style={[styles.settingItem, { backgroundColor: colors.surface }]}
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={`${label}: ${value}`}
          activeOpacity={0.7}
        >
          {content}
        </TouchableOpacity>
      );
    }

    return (
      <View
        style={[styles.settingItem, { backgroundColor: colors.surface }]}
        accessibilityLabel={`${label}: ${value}`}
      >
        {content}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Appearance
            </Text>
            {renderSettingItem(
              'Theme',
              getThemeModeText(),
              'moon-outline',
              handleToggleDarkMode
            )}
          </View>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Legal
            </Text>
            {renderSettingItem(
              'Privacy Policy',
              'Read our privacy policy',
              'shield-outline',
              () => setShowPrivacyPolicy(true)
            )}
            {renderSettingItem(
              'Terms of Service',
              'Read our terms of service',
              'document-text-outline',
              () => setShowTermsOfService(true)
            )}
          </View>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              About
            </Text>
            {renderSettingItem(
              'Version',
              getAppVersion(),
              'information-circle-outline'
            )}
          </View>
        </View>
      </ScrollView>
      <PrivacyPolicyModal
        visible={showPrivacyPolicy}
        onClose={() => setShowPrivacyPolicy(false)}
      />
      <TermsOfServiceModal
        visible={showTermsOfService}
        onClose={() => setShowTermsOfService(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingItemText: {
    marginLeft: 12,
    flex: 1,
  },
  settingItemLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingItemValue: {
    fontSize: 14,
  },
});

