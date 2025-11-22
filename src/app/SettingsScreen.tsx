import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';

/**
 * Settings screen for app configuration
 */
export const SettingsScreen: React.FC = () => {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            {/* TODO: Implement settings screen - currently placeholder */}
            {/* TODO: Replace hardcoded strings with i18n translations */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Settings</Text>
            <Text style={[styles.placeholderText, { color: colors.textSecondary }]}>
              Settings feature coming soon
            </Text>
            <Text style={[styles.placeholderSubtext, { color: colors.textTertiary }]}>
              You'll be able to configure default time units, theme preferences, and more.
            </Text>
          </View>
        </View>
      </ScrollView>
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
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  placeholderText: {
    fontSize: 16,
    marginBottom: 8,
  },
  placeholderSubtext: {
    fontSize: 14,
  },
});

