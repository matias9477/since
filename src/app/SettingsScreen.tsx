import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors } from '@/theme';

/**
 * Settings screen for app configuration
 */
export const SettingsScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <Text style={styles.placeholderText}>
            Settings feature coming soon
          </Text>
          <Text style={styles.placeholderSubtext}>
            You'll be able to configure default time units, theme preferences, and more.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  content: {
    padding: 16,
  },
  section: {
    backgroundColor: colors.background.primary,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  placeholderText: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: colors.text.tertiary,
  },
});

