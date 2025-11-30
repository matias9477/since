import React from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, getThemeColors } from '@/theme';

interface PrivacyPolicyModalProps {
  visible: boolean;
  onClose: () => void;
}

/**
 * Modal component displaying the Privacy Policy
 */
export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  visible,
  onClose,
}) => {
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
        edges={['top', 'bottom']}
      >
        <View
          style={[
            styles.header,
            { backgroundColor: colors.surface, borderBottomColor: colors.border },
          ]}
        >
          <Text style={[styles.title, { color: colors.text }]}>
            Privacy Policy
          </Text>
          <TouchableOpacity
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Close privacy policy"
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Data Collection & Storage
            </Text>
            <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
              Since collects and stores event data locally on your device. All
              information you enter, including event titles, descriptions, dates,
              and preferences, is stored securely on your device using local
              database storage. We do not transmit, share, or access your data
              externally.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Data Export
            </Text>
            <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
              You can export your event data at any time through the app's
              export functionality. Your data remains under your control, and
              you can manage it as you see fit.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Notifications
            </Text>
            <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
              If you enable notifications, the app will use your device's local
              notification system to remind you of events. Notification
              preferences are stored locally and can be changed at any time in
              the app settings.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Third-Party Services
            </Text>
            <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
              Since does not use third-party analytics, advertising, or tracking
              services. All functionality operates entirely on your device
              without external data transmission.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Data Deletion
            </Text>
            <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
              You can delete individual events or all data at any time through
              the app. Deleting the app will remove all stored data from your
              device. We do not retain copies of your data.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Contact
            </Text>
            <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
              If you have questions about this Privacy Policy or how your data
              is handled, please contact us through the app's support channels.
            </Text>
          </View>

          <Text style={[styles.lastUpdated, { color: colors.textTertiary }]}>
            Last updated: {new Date().toLocaleDateString()}
          </Text>
        </ScrollView>

        <View
          style={[
            styles.footer,
            { backgroundColor: colors.surface, borderTopColor: colors.border },
          ]}
        >
          <TouchableOpacity
            style={[styles.footerButton, { backgroundColor: colors.primary }]}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="I understand"
            activeOpacity={0.8}
          >
            <Text style={styles.footerButtonText}>I Understand</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 22,
  },
  lastUpdated: {
    fontSize: 12,
    marginTop: 8,
    marginBottom: 16,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  footerButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

