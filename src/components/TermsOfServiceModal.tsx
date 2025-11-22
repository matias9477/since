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

interface TermsOfServiceModalProps {
  visible: boolean;
  onClose: () => void;
}

/**
 * Modal component displaying the Terms of Service
 */
export const TermsOfServiceModal: React.FC<TermsOfServiceModalProps> = ({
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
            Terms of Service
          </Text>
          <TouchableOpacity
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Close terms of service"
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              1. Acceptance
            </Text>
            <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
              By accessing and using Since, you accept and agree to be bound by
              the terms and provision of this agreement. If you do not agree to
              these terms, please do not use the application.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              2. Description
            </Text>
            <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
              Since is a mobile application that allows you to track events and
              calculate time elapsed since those events. The app stores data
              locally on your device and does not require an internet connection
              for core functionality.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              3. Responsibilities
            </Text>
            <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
              You are responsible for maintaining the confidentiality of your
              device and any data stored within the app. You agree to use the
              app in compliance with all applicable laws and regulations.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              4. Data & Privacy
            </Text>
            <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
              All data entered into Since is stored locally on your device. We
              do not collect, transmit, or access your personal data. Please
              refer to our Privacy Policy for detailed information about data
              handling.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              5. Updates
            </Text>
            <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
              The app may be updated from time to time to add new features or
              improve existing functionality. Updates may be provided through
              your device's app store.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              6. Limitation of Liability
            </Text>
            <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
              Since is provided "as is" without warranties of any kind. We are
              not liable for any loss of data, damages, or other issues arising
              from the use of the application. You are responsible for backing
              up your data.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              7. Termination
            </Text>
            <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
              You may stop using the app at any time. Uninstalling the app will
              remove all data stored locally on your device. We reserve the
              right to discontinue the app or its services at any time.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              8. Changes
            </Text>
            <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
              We reserve the right to modify these terms at any time. Continued
              use of the app after changes constitutes acceptance of the new
              terms.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              9. Governing Law
            </Text>
            <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
              These terms shall be governed by and construed in accordance with
              applicable local laws, without regard to conflict of law
              provisions.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              10. Contact
            </Text>
            <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
              If you have any questions about these Terms of Service, please
              contact us through the app's support channels.
            </Text>
          </View>

          <Text style={[styles.lastUpdated, { color: colors.textSecondary }]}>
            Last updated: {new Date().toLocaleDateString()}
          </Text>
        </ScrollView>
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
  content: {
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
});

