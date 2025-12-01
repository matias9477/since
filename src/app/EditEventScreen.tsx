import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DateTimePicker } from "@/components/shared/DateTimePicker";
import { useEventsStore } from "@/features/events/eventsStore";
import { useRemindersStore } from "@/features/reminders/remindersStore";
import { RECURRENCE_FREQUENCIES, REMINDER_TYPES } from "@/config/constants";
import { EVENT_ICONS, type EventIconName } from "@/config/eventIcons";
import { PickerModal } from "@/components/shared/PickerModal";
import { DateSelector } from "@/components/shared/DateSelector";
import { useTheme } from "../theme";
import type { ReminderType, RecurrenceFrequency } from "@/config/types";
import type { CreateEventInput } from "@/features/events/types";
import type {
  CreateReminderInput,
  UpdateReminderInput,
} from "@/features/reminders/types";
import type { RootStackParamList } from "@/navigation/types";

type EditEventScreenRouteProp = RouteProp<RootStackParamList, "EditEvent">;
type EditEventScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "EditEvent"
>;

/**
 * Screen for creating or editing an event
 */
export const EditEventScreen: React.FC = () => {
  const navigation = useNavigation<EditEventScreenNavigationProp>();
  const route = useRoute<EditEventScreenRouteProp>();
  const { eventId } = route.params || {};
  const { createEvent, updateEvent, deleteEvent, getEventById } =
    useEventsStore();
  const {
    reminders,
    loadReminders,
    createReminder,
    deleteReminder,
    getRemindersByEventId,
  } = useRemindersStore();
  const { colors } = useTheme();

  /**
   * Normalizes a date to midnight (00:00:00) to remove time component
   */
  const normalizeToMidnight = (date: Date): Date => {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
  };

  // Initialize startDate with today's date normalized to midnight
  const [startDate, setStartDate] = useState(() =>
    normalizeToMidnight(new Date())
  );
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState<EventIconName | null>(null);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [editingReminderId, setEditingReminderId] = useState<string | null>(
    null
  );
  const [reminderType, setReminderType] = useState<ReminderType>("recurring");
  const [recurrenceFrequency, setRecurrenceFrequency] =
    useState<RecurrenceFrequency>("monthly");
  const [reminderDate, setReminderDate] = useState(new Date());
  const [showReminderDatePicker, setShowReminderDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const event = eventId ? getEventById(eventId) : null;
  const isEditing = !!event;
  const eventReminders = eventId ? getRemindersByEventId(eventId) : [];

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description || "");
      // Normalize date to midnight when loading existing event
      setStartDate(normalizeToMidnight(event.startDate));
      setIcon(event.icon as EventIconName | null);
    }
  }, [event]);

  useEffect(() => {
    if (eventId) {
      loadReminders(eventId);
    }
  }, [eventId, loadReminders]);

  useEffect(() => {
    // TODO: Replace hardcoded strings with i18n translations
    navigation.setOptions({
      title: isEditing ? "Edit Event" : "New Event",
    });
  }, [isEditing, navigation]);

  const handleSave = async () => {
    // TODO: Replace hardcoded error messages with i18n translations
    if (!title.trim()) {
      Alert.alert("Validation Error", "Title is required");
      return;
    }

    if (!startDate || !(startDate instanceof Date)) {
      Alert.alert("Validation Error", "Please select a valid start date");
      return;
    }

    setIsLoading(true);

    try {
      // Normalize date to midnight to remove time component
      const normalizedDate = normalizeToMidnight(
        startDate instanceof Date ? startDate : new Date(startDate)
      );

      const input: CreateEventInput = {
        title: title.trim(),
        ...(description.trim() && { description: description.trim() }),
        startDate: normalizedDate,
        showTimeAs: "days",
        ...(icon && { icon }),
      };

      if (isEditing && eventId) {
        await updateEvent(eventId, input);
        navigation.goBack();
      } else {
        await createEvent(input);
        // Navigate to home after creating a new event
        navigation.navigate("MainTabs");
      }
    } catch (error) {
      console.error("Error saving event:", error);
      // TODO: Replace hardcoded error message with i18n translations
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to save event"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReminderDateConfirm = (selectedDate: Date) => {
    if (
      selectedDate &&
      selectedDate instanceof Date &&
      !isNaN(selectedDate.getTime())
    ) {
      setReminderDate(selectedDate);
    } else {
      // If date is invalid, reset to current date
      setReminderDate(new Date());
    }
    setShowReminderDatePicker(false);
  };

  const handleReminderDateCancel = () => {
    setShowReminderDatePicker(false);
  };

  const handleOpenReminderModal = (reminderId?: string) => {
    if (reminderId) {
      const reminder = reminders.find((r) => r.id === reminderId);
      if (reminder) {
        setEditingReminderId(reminderId);
        setReminderType(reminder.type);
        setRecurrenceFrequency(reminder.recurrenceRule || "monthly");
        setReminderDate(reminder.scheduledAt || new Date());
      }
    } else {
      setEditingReminderId(null);
      setReminderType("recurring");
      setRecurrenceFrequency("monthly");
      setReminderDate(new Date());
    }
    setShowReminderModal(true);
  };

  const handleSaveReminder = async () => {
    if (!eventId) return;

    try {
      if (editingReminderId) {
        // Update existing reminder
        const updateInput: UpdateReminderInput = {
          type: reminderType,
          ...(reminderType === "recurring"
            ? { recurrenceRule: recurrenceFrequency }
            : { scheduledAt: reminderDate }),
        };
        await useRemindersStore
          .getState()
          .updateReminder(editingReminderId, updateInput);
      } else {
        // Create new reminder
        const input: CreateReminderInput = {
          eventId,
          type: reminderType,
          ...(reminderType === "recurring"
            ? { recurrenceRule: recurrenceFrequency }
            : { scheduledAt: reminderDate }),
        };
        await createReminder(input);
      }
      setShowReminderModal(false);
      if (eventId) {
        await loadReminders(eventId);
      }
    } catch (error) {
      console.error("Error saving reminder:", error);
      Alert.alert("Error", "Failed to save reminder");
    }
  };

  const handleDeleteReminder = async (reminderId: string) => {
    Alert.alert(
      "Delete Reminder",
      "Are you sure you want to delete this reminder?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteReminder(reminderId);
            if (eventId) {
              await loadReminders(eventId);
            }
          },
        },
      ]
    );
  };

  const handleDelete = () => {
    if (!eventId) return;

    // TODO: Replace hardcoded alert strings with i18n translations
    Alert.alert(
      "Delete Event",
      "Are you sure you want to delete this event? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const success = await deleteEvent(eventId);
            if (success) {
              // Reset navigation to Home instead of going back to EventDetail (which no longer exists)
              navigation.reset({
                index: 0,
                routes: [{ name: "MainTabs" }],
              });
            } else {
              Alert.alert("Error", "Failed to delete event");
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["bottom"]}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.form}>
          <View style={styles.field}>
            {/* TODO: Replace hardcoded label with i18n translations */}
            <Text style={[styles.label, { color: colors.text }]}>Title *</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter event title"
              placeholderTextColor={colors.textTertiary}
              accessibilityLabel="Event title"
            />
          </View>

          <View style={styles.field}>
            {/* TODO: Replace hardcoded label and placeholder with i18n translations */}
            <Text style={[styles.label, { color: colors.text }]}>
              Description
            </Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter event description (optional)"
              placeholderTextColor={colors.textTertiary}
              multiline
              numberOfLines={4}
              accessibilityLabel="Event description"
            />
          </View>

          <DateSelector
            date={startDate}
            onDateChange={setStartDate}
            label="Start Date"
            maximumDate={new Date()}
          />

          <View style={styles.field}>
            {/* TODO: Replace hardcoded label with i18n translations */}
            <Text style={[styles.label, { color: colors.text }]}>Icon</Text>
            <TouchableOpacity
              style={[
                styles.selectButton,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
              onPress={() => setShowIconPicker(true)}
              accessibilityRole="button"
              accessibilityLabel="Select icon"
              activeOpacity={0.7}
            >
              <View style={styles.iconSelectContent}>
                {icon ? (
                  <>
                    <Ionicons name={icon} size={20} color={colors.text} />
                    <Text
                      style={[
                        styles.selectButtonText,
                        { color: colors.text, marginLeft: 8 },
                      ]}
                    >
                      {EVENT_ICONS.find((i) => i.name === icon)?.label || icon}
                    </Text>
                  </>
                ) : (
                  <Text
                    style={[
                      styles.selectButtonText,
                      { color: colors.textTertiary },
                    ]}
                  >
                    No icon
                  </Text>
                )}
              </View>
              <Ionicons
                name="chevron-down"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>

            {/* Icon Picker Modal */}
            <PickerModal<EventIconName | null>
              visible={showIconPicker}
              title="Select Icon"
              options={[
                {
                  value: null,
                  label: "No icon",
                  renderCustom: (isSelected, themeColors) => (
                    <>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "500",
                          textTransform: "capitalize",
                          color: isSelected
                            ? themeColors.primary
                            : themeColors.text,
                        }}
                      >
                        No icon
                      </Text>
                      {isSelected && (
                        <Ionicons
                          name="checkmark"
                          size={20}
                          color={themeColors.primary}
                        />
                      )}
                    </>
                  ),
                },
                ...EVENT_ICONS.map((iconOption) => ({
                  value: iconOption.name as EventIconName | null,
                  label: iconOption.label,
                  icon: iconOption.name,
                })),
              ]}
              selectedValue={icon}
              onSelect={setIcon}
              onClose={() => setShowIconPicker(false)}
              maxHeight="80%"
            />
          </View>

          {/* Reminders Section - only show when editing existing event */}
          {isEditing && eventId && (
            <View style={styles.field}>
              <View style={styles.remindersHeader}>
                <Text style={[styles.label, { color: colors.text }]}>
                  Reminders
                </Text>
                <TouchableOpacity
                  onPress={() => handleOpenReminderModal()}
                  style={[
                    styles.addReminderButton,
                    { backgroundColor: colors.primary },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel="Add reminder"
                >
                  <Ionicons name="add" size={18} color="#FFFFFF" />
                  <Text style={styles.addReminderButtonText}>Add Reminder</Text>
                </TouchableOpacity>
              </View>
              {eventReminders.length === 0 ? (
                <Text
                  style={[styles.emptyText, { color: colors.textTertiary }]}
                >
                  No reminders set
                </Text>
              ) : (
                <View style={styles.remindersList}>
                  {eventReminders.map((reminder) => (
                    <View
                      key={reminder.id}
                      style={[
                        styles.reminderItem,
                        {
                          backgroundColor: colors.surface,
                          borderColor: colors.border,
                        },
                      ]}
                    >
                      <View style={styles.reminderItemLeft}>
                        <View style={styles.reminderItemHeader}>
                          <Ionicons
                            name={
                              reminder.type === "recurring" ? "repeat" : "time"
                            }
                            size={20}
                            color={colors.primary}
                          />
                          <Text
                            style={[
                              styles.reminderItemLabel,
                              { color: colors.text },
                            ]}
                          >
                            {reminder.type === "recurring"
                              ? "Recurring"
                              : "One-time"}
                          </Text>
                        </View>
                        {reminder.recurrenceRule && (
                          <Text
                            style={[
                              styles.reminderItemSubtext,
                              { color: colors.textSecondary },
                            ]}
                          >
                            {reminder.recurrenceRule.charAt(0).toUpperCase() +
                              reminder.recurrenceRule.slice(1)}
                          </Text>
                        )}
                        {reminder.scheduledAt && (
                          <Text
                            style={[
                              styles.reminderItemSubtext,
                              { color: colors.textSecondary },
                            ]}
                          >
                            {reminder.scheduledAt.toLocaleDateString()} at{" "}
                            {reminder.scheduledAt.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </Text>
                        )}
                      </View>
                      <View style={styles.reminderItemActions}>
                        <TouchableOpacity
                          onPress={() => handleOpenReminderModal(reminder.id)}
                          style={styles.reminderActionButton}
                          accessibilityRole="button"
                          accessibilityLabel="Edit reminder"
                        >
                          <Ionicons
                            name="pencil"
                            size={18}
                            color={colors.textSecondary}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => handleDeleteReminder(reminder.id)}
                          style={styles.reminderActionButton}
                          accessibilityRole="button"
                          accessibilityLabel="Delete reminder"
                        >
                          <Ionicons
                            name="trash"
                            size={18}
                            color={colors.error}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.saveButton,
              { backgroundColor: colors.primary },
              isLoading && styles.saveButtonDisabled,
            ]}
            onPress={handleSave}
            disabled={isLoading}
            accessibilityRole="button"
            accessibilityLabel="Save event"
          >
            {/* TODO: Replace hardcoded button text with i18n translations */}
            <Text style={styles.saveButtonText}>
              {isLoading ? "Saving..." : "Save"}
            </Text>
          </TouchableOpacity>

          {isEditing && (
            <TouchableOpacity
              style={[styles.deleteButton, { backgroundColor: colors.error }]}
              onPress={handleDelete}
              accessibilityRole="button"
              accessibilityLabel="Delete event"
            >
              {/* TODO: Replace hardcoded button text with i18n translations */}
              <Text style={styles.deleteButtonText}>Delete Event</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Reminder Modal */}
      <Modal
        visible={showReminderModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowReminderModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowReminderModal(false)}
        >
          <SafeAreaView edges={["bottom"]} style={styles.modalSafeArea}>
            <View
              style={[
                styles.modalContent,
                {
                  backgroundColor: colors.surface,
                  maxHeight: reminderType === "recurring" ? "95%" : "60%",
                  minHeight: reminderType === "recurring" ? 500 : 350,
                },
              ]}
              onStartShouldSetResponder={() => true}
            >
              <View
                style={[
                  styles.modalHeader,
                  { borderBottomColor: colors.border },
                ]}
              >
                <Text style={[styles.modalTitle, { color: colors.text }]}>
                  {editingReminderId ? "Edit Reminder" : "Add Reminder"}
                </Text>
                <View style={styles.modalHeaderActions}>
                  <TouchableOpacity
                    onPress={handleSaveReminder}
                    style={styles.modalHeaderButton}
                    accessibilityRole="button"
                    accessibilityLabel="Save reminder"
                  >
                    <Ionicons
                      name="checkmark"
                      size={24}
                      color={colors.primary}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setShowReminderModal(false)}
                    style={styles.modalHeaderButton}
                    accessibilityRole="button"
                    accessibilityLabel="Close reminder modal"
                  >
                    <Ionicons name="close" size={24} color={colors.text} />
                  </TouchableOpacity>
                </View>
              </View>
              <ScrollView
                style={styles.modalOptions}
                contentContainerStyle={styles.modalOptionsContent}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.field}>
                  <Text style={[styles.label, { color: colors.text }]}>
                    Type
                  </Text>
                  <View style={styles.reminderTypeButtons}>
                    {REMINDER_TYPES.map((type) => (
                      <TouchableOpacity
                        key={type}
                        style={[
                          styles.reminderTypeButton,
                          {
                            backgroundColor:
                              reminderType === type
                                ? colors.primary + "20"
                                : colors.surface,
                            borderColor:
                              reminderType === type
                                ? colors.primary
                                : colors.border,
                          },
                        ]}
                        onPress={() => setReminderType(type)}
                        accessibilityRole="button"
                        accessibilityLabel={`Select ${type}`}
                      >
                        <Ionicons
                          name={type === "recurring" ? "repeat" : "time"}
                          size={18}
                          color={
                            reminderType === type ? colors.primary : colors.text
                          }
                        />
                        <Text
                          style={[
                            styles.reminderTypeButtonText,
                            {
                              color:
                                reminderType === type
                                  ? colors.primary
                                  : colors.text,
                            },
                          ]}
                        >
                          {type === "recurring" ? "Recurring" : "One-time"}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {reminderType === "recurring" && (
                  <View style={styles.field}>
                    <Text style={[styles.label, { color: colors.text }]}>
                      Frequency
                    </Text>
                    <View style={styles.frequencyOptions}>
                      {RECURRENCE_FREQUENCIES.map((freq) => (
                        <TouchableOpacity
                          key={freq}
                          style={[
                            styles.frequencyOption,
                            recurrenceFrequency === freq && {
                              backgroundColor: colors.primary + "20",
                            },
                          ]}
                          onPress={() => setRecurrenceFrequency(freq)}
                          accessibilityRole="button"
                          accessibilityLabel={`Select ${freq}`}
                        >
                          <Text
                            style={[
                              styles.frequencyOptionText,
                              {
                                color:
                                  recurrenceFrequency === freq
                                    ? colors.primary
                                    : colors.text,
                              },
                            ]}
                          >
                            {freq.charAt(0).toUpperCase() + freq.slice(1)}
                          </Text>
                          {recurrenceFrequency === freq && (
                            <Ionicons
                              name="checkmark"
                              size={20}
                              color={colors.primary}
                            />
                          )}
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}

                {reminderType === "one_off" && (
                  <View style={styles.field}>
                    <Text style={[styles.label, { color: colors.text }]}>
                      Date & Time
                    </Text>
                    <TouchableOpacity
                      style={[
                        styles.dateButton,
                        {
                          backgroundColor: colors.surface,
                          borderColor: colors.border,
                        },
                      ]}
                      onPress={() => setShowReminderDatePicker(true)}
                      accessibilityRole="button"
                      accessibilityLabel="Select reminder date"
                    >
                      <Text style={[styles.dateText, { color: colors.text }]}>
                        {reminderDate.toLocaleDateString()} at{" "}
                        {reminderDate.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Text>
                      <Ionicons
                        name="calendar-outline"
                        size={20}
                        color={colors.textSecondary}
                      />
                    </TouchableOpacity>
                    <DateTimePicker
                      isVisible={showReminderDatePicker}
                      date={
                        reminderDate instanceof Date &&
                        !isNaN(reminderDate.getTime())
                          ? reminderDate
                          : new Date()
                      }
                      onConfirm={handleReminderDateConfirm}
                      onCancel={handleReminderDateCancel}
                      mode="datetime"
                      display="inline"
                    />
                  </View>
                )}
              </ScrollView>
            </View>
          </SafeAreaView>
        </TouchableOpacity>
      </Modal>
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
  form: {
    padding: 16,
  },
  field: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  dateButton: {
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateText: {
    fontSize: 16,
    flex: 1,
  },
  selectButton: {
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectButtonText: {
    fontSize: 16,
    textTransform: "capitalize",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    flex: 1,
  },
  modalHeaderActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  modalHeaderButton: {
    padding: 4,
  },
  modalSafeArea: {
    maxHeight: "95%",
    justifyContent: "flex-end",
  },
  modalOptions: {
    flex: 1,
  },
  modalOptionsContent: {
    padding: 16,
    paddingBottom: 32,
  },
  iconSelectContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  saveButton: {
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  deleteButton: {
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 16,
  },
  deleteButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  remindersHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  addReminderButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addReminderButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyText: {
    fontSize: 14,
    fontStyle: "italic",
    textAlign: "center",
    paddingVertical: 8,
  },
  remindersList: {
    gap: 10,
  },
  reminderItem: {
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  reminderItemLeft: {
    flex: 1,
    marginRight: 12,
  },
  reminderItemHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  reminderItemLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  reminderItemSubtext: {
    fontSize: 14,
    marginTop: 4,
    lineHeight: 20,
  },
  reminderItemActions: {
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-start",
    paddingTop: 2,
  },
  reminderActionButton: {
    padding: 6,
  },
  reminderTypeButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  reminderTypeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  reminderTypeButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  frequencyOptions: {
    marginTop: 8,
    gap: 4,
  },
  frequencyOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 2,
  },
  frequencyOptionText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
