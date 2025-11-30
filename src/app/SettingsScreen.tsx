import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/theme/index";
import { useThemeStore } from "@/store/themeStore";
import { getAppVersion } from "@/utils/version";
import { PrivacyPolicyModal } from "@/components/shared/PrivacyPolicyModal";
import { TermsOfServiceModal } from "@/components/shared/TermsOfServiceModal";
import {
  sendTestNotification,
  sendTestMilestoneNotification,
  sendTestReminderNotification,
} from "@/utils/notifications";

/**
 * Settings screen for app configuration
 */
export const SettingsScreen: React.FC = () => {
  const { colors, themeMode } = useTheme();
  const { setThemeMode } = useThemeStore();
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTermsOfService, setShowTermsOfService] = useState(false);
  const [isTestingNotification, setIsTestingNotification] = useState(false);

  /**
   * Handles theme mode toggle, cycling through: system → light → dark → system
   */
  const handleToggleDarkMode = () => {
    const nextMode =
      themeMode === "system"
        ? "light"
        : themeMode === "light"
          ? "dark"
          : "system";
    setThemeMode(nextMode);
  };

  /**
   * Gets the display text for the current theme mode
   */
  const getThemeModeText = () => {
    if (themeMode === "system") {
      return "Follow system setting";
    }
    if (themeMode === "light") {
      return "Light mode";
    }
    return "Dark mode";
  };

  /**
   * Handles test notification button press
   */
  const handleTestNotification = async (
    type: "basic" | "milestone" | "reminder"
  ) => {
    if (isTestingNotification) return;

    setIsTestingNotification(true);
    try {
      let identifier = "";
      switch (type) {
        case "basic":
          identifier = await sendTestNotification();
          break;
        case "milestone":
          identifier = await sendTestMilestoneNotification("Test Event");
          break;
        case "reminder":
          identifier = await sendTestReminderNotification(
            "Test Event",
            "one-time"
          );
          break;
      }

      if (identifier) {
        Alert.alert(
          "Success",
          "Test notification sent! Check your notifications."
        );
      } else {
        Alert.alert(
          "Error",
          "Failed to send test notification. Make sure notifications are enabled in your device settings."
        );
      }
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error
          ? error.message
          : "Failed to send test notification"
      );
    } finally {
      setIsTestingNotification(false);
    }
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
            <Text
              style={[styles.settingItemValue, { color: colors.textSecondary }]}
            >
              {value}
            </Text>
          </View>
        </View>
        {onPress && (
          <Ionicons
            name="chevron-forward"
            size={20}
            color={colors.textTertiary}
          />
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
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Customize your experience
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Appearance
            </Text>
            {renderSettingItem(
              "Theme",
              getThemeModeText(),
              "moon-outline",
              handleToggleDarkMode
            )}
          </View>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Legal
            </Text>
            {renderSettingItem(
              "Privacy Policy",
              "Read our privacy policy",
              "shield-outline",
              () => setShowPrivacyPolicy(true)
            )}
            {renderSettingItem(
              "Terms of Service",
              "Read our terms of service",
              "document-text-outline",
              () => setShowTermsOfService(true)
            )}
          </View>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              About
            </Text>
            {renderSettingItem(
              "Version",
              getAppVersion(),
              "information-circle-outline"
            )}
          </View>
          {/* <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Developer
            </Text>
            <Text style={[styles.devSubtitle, { color: colors.textSecondary }]}>
              Test notification functionality
            </Text>
            <TouchableOpacity
              style={[
                styles.devButton,
                { backgroundColor: colors.surface },
                isTestingNotification && styles.devButtonDisabled,
              ]}
              onPress={() => handleTestNotification('basic')}
              disabled={isTestingNotification}
              accessibilityRole="button"
              accessibilityLabel="Test basic notification"
              activeOpacity={0.7}
            >
              <Ionicons name="notifications-outline" size={20} color={colors.primary} />
              <Text style={[styles.devButtonText, { color: colors.text }]}>
                Test Basic Notification
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.devButton,
                { backgroundColor: colors.surface },
                isTestingNotification && styles.devButtonDisabled,
              ]}
              onPress={() => handleTestNotification('milestone')}
              disabled={isTestingNotification}
              accessibilityRole="button"
              accessibilityLabel="Test milestone notification"
              activeOpacity={0.7}
            >
              <Ionicons name="trophy-outline" size={20} color={colors.primary} />
              <Text style={[styles.devButtonText, { color: colors.text }]}>
                Test Milestone Notification
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.devButton,
                { backgroundColor: colors.surface },
                isTestingNotification && styles.devButtonDisabled,
              ]}
              onPress={() => handleTestNotification('reminder')}
              disabled={isTestingNotification}
              accessibilityRole="button"
              accessibilityLabel="Test reminder notification"
              activeOpacity={0.7}
            >
              <Ionicons name="time-outline" size={20} color={colors.primary} />
              <Text style={[styles.devButtonText, { color: colors.text }]}>
                Test Reminder Notification
              </Text>
            </TouchableOpacity>
          </View> */}
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
  header: {
    marginBottom: 32,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  settingItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingItemText: {
    marginLeft: 12,
    flex: 1,
  },
  settingItemLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 2,
  },
  settingItemValue: {
    fontSize: 14,
  },
  devSubtitle: {
    fontSize: 14,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  devButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    gap: 12,
  },
  devButtonDisabled: {
    opacity: 0.5,
  },
  devButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
