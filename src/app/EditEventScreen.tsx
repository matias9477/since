import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useEventsStore } from '@/features/events/eventsStore';
import { TIME_UNITS, DEFAULT_TIME_UNIT } from '@/config/constants';
import { useTheme } from '@/theme';
import type { TimeUnit } from '@/config/types';
import type { CreateEventInput } from '@/features/events/types';
import type { RootStackParamList } from '@/navigation/types';

type EditEventScreenRouteProp = RouteProp<RootStackParamList, 'EditEvent'>;
type EditEventScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'EditEvent'>;

/**
 * Screen for creating or editing an event
 */
export const EditEventScreen: React.FC = () => {
  const navigation = useNavigation<EditEventScreenNavigationProp>();
  const route = useRoute<EditEventScreenRouteProp>();
  const { eventId } = route.params || {};
  const { events, createEvent, updateEvent, deleteEvent, getEventById } = useEventsStore();
  const { colors } = useTheme();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [showTimeAs, setShowTimeAs] = useState<TimeUnit>(DEFAULT_TIME_UNIT);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimeUnitPicker, setShowTimeUnitPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const event = eventId ? getEventById(eventId) : null;
  const isEditing = !!event;

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description || '');
      setStartDate(event.startDate);
      setShowTimeAs(event.showTimeAs);
    }
  }, [event]);

  useEffect(() => {
    // TODO: Replace hardcoded strings with i18n translations
    navigation.setOptions({
      title: isEditing ? 'Edit Event' : 'New Event',
    });
  }, [isEditing, navigation]);

  const handleSave = async () => {
    // TODO: Replace hardcoded error messages with i18n translations
    if (!title.trim()) {
      Alert.alert('Validation Error', 'Title is required');
      return;
    }

    if (!startDate || !(startDate instanceof Date)) {
      Alert.alert('Validation Error', 'Please select a valid start date');
      return;
    }

    setIsLoading(true);

    try {
      const input: CreateEventInput = {
        title: title.trim(),
        description: description.trim() || undefined,
        startDate: startDate instanceof Date ? startDate : new Date(startDate),
        showTimeAs,
      };

      if (isEditing && eventId) {
        await updateEvent(eventId, input);
      } else {
        await createEvent(input);
      }

      navigation.goBack();
    } catch (error) {
      console.error('Error saving event:', error);
      // TODO: Replace hardcoded error message with i18n translations
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to save event');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateConfirm = (selectedDate: Date) => {
    if (selectedDate && selectedDate instanceof Date && !isNaN(selectedDate.getTime())) {
      setStartDate(selectedDate);
    }
    setShowDatePicker(false);
  };

  const handleDateCancel = () => {
    setShowDatePicker(false);
  };

  const handleDelete = () => {
    if (!eventId) return;
    
    // TODO: Replace hardcoded alert strings with i18n translations
    Alert.alert(
      'Delete Event',
      'Are you sure you want to delete this event? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const success = await deleteEvent(eventId);
            if (success) {
              // Reset navigation to Home instead of going back to EventDetail (which no longer exists)
              navigation.reset({
                index: 0,
                routes: [{ name: 'MainTabs' }],
              });
            } else {
              Alert.alert('Error', 'Failed to delete event');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.form}>
        <View style={styles.field}>
          {/* TODO: Replace hardcoded label with i18n translations */}
          <Text style={[styles.label, { color: colors.text }]}>Title *</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter event title"
            placeholderTextColor={colors.textTertiary}
            accessibilityLabel="Event title"
          />
        </View>

        <View style={styles.field}>
          {/* TODO: Replace hardcoded label and placeholder with i18n translations */}
          <Text style={[styles.label, { color: colors.text }]}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
            value={description}
            onChangeText={setDescription}
            placeholder="Enter event description (optional)"
            placeholderTextColor={colors.textTertiary}
            multiline
            numberOfLines={4}
            accessibilityLabel="Event description"
          />
        </View>

        <View style={styles.field}>
          {/* TODO: Replace hardcoded label with i18n translations */}
          <Text style={[styles.label, { color: colors.text }]}>Start Date</Text>
          <TouchableOpacity
            style={[styles.dateButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => setShowDatePicker(true)}
            accessibilityRole="button"
            accessibilityLabel="Select start date"
            activeOpacity={0.7}
          >
            <Text style={[styles.dateText, { color: colors.text }]}>
              {/* TODO: Replace hardcoded locale 'en-US' with user's language preference from settings */}
              {startDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
            <Ionicons name="calendar-outline" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={showDatePicker}
            mode="date"
            date={startDate}
            onConfirm={handleDateConfirm}
            onCancel={handleDateCancel}
            maximumDate={new Date()}
            display="spinner"
            // TODO: Replace hardcoded themeVariant with user's theme preference from settings
            themeVariant="light"
          />
        </View>

        <View style={styles.field}>
          {/* TODO: Replace hardcoded label with i18n translations */}
          <Text style={[styles.label, { color: colors.text }]}>Show Time As</Text>
          <TouchableOpacity
            style={[styles.selectButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => setShowTimeUnitPicker(true)}
            accessibilityRole="button"
            accessibilityLabel="Select time unit"
            activeOpacity={0.7}
          >
            <Text style={[styles.selectButtonText, { color: colors.text }]}>
              {showTimeAs.charAt(0).toUpperCase() + showTimeAs.slice(1)}
            </Text>
            <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          
          {/* Time Unit Picker Modal */}
          <Modal
            visible={showTimeUnitPicker}
            transparent
            animationType="slide"
            onRequestClose={() => setShowTimeUnitPicker(false)}
          >
            <TouchableOpacity
              style={styles.modalOverlay}
              activeOpacity={1}
              onPress={() => setShowTimeUnitPicker(false)}
            >
              <SafeAreaView
                style={[styles.modalContent, { backgroundColor: colors.surface }]}
                edges={['bottom']}
              >
                <View
                  style={{ flex: 1 }}
                  onStartShouldSetResponder={() => true}
                >
                  <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
                    <Text style={[styles.modalTitle, { color: colors.text }]}>Select Time Unit</Text>
                    <TouchableOpacity
                      onPress={() => setShowTimeUnitPicker(false)}
                      accessibilityRole="button"
                      accessibilityLabel="Close time unit picker"
                    >
                      <Ionicons name="close" size={24} color={colors.text} />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.modalOptions}>
                    {TIME_UNITS.map((unit) => (
                      <TouchableOpacity
                        key={unit}
                        style={[
                          styles.optionItem,
                          showTimeAs === unit && {
                            backgroundColor: colors.primary + '20',
                          },
                        ]}
                        onPress={() => {
                          setShowTimeAs(unit);
                          setShowTimeUnitPicker(false);
                        }}
                        accessibilityRole="button"
                        accessibilityLabel={`Select ${unit}`}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.optionText,
                            { color: showTimeAs === unit ? colors.primary : colors.text },
                          ]}
                        >
                          {unit.charAt(0).toUpperCase() + unit.slice(1)}
                        </Text>
                        {showTimeAs === unit && (
                          <Ionicons name="checkmark" size={20} color={colors.primary} />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </SafeAreaView>
            </TouchableOpacity>
          </Modal>
        </View>

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
            {isLoading ? 'Saving...' : 'Save'}
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
    fontWeight: '600',
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
    textAlignVertical: 'top',
  },
  dateButton: {
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    flex: 1,
  },
  selectButton: {
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectButtonText: {
    fontSize: 16,
    textTransform: 'capitalize',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '50%',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  modalOptions: {
    padding: 8,
    paddingBottom: 0,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 8,
    marginVertical: 4,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  saveButton: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

