import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
  const { events, createEvent, updateEvent, getEventById } = useEventsStore();
  const { colors } = useTheme();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [showTimeAs, setShowTimeAs] = useState<TimeUnit>(DEFAULT_TIME_UNIT);
  const [showDatePicker, setShowDatePicker] = useState(false);
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
            {/* TODO: Replace hardcoded emoji with icon from theme/icons library */}
            <Text style={styles.dateIcon}>📅</Text>
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
          <Text style={styles.label}>Show Time As</Text>
          <View style={styles.unitContainer}>
            {TIME_UNITS.map((unit) => (
              <TouchableOpacity
                key={unit}
                style={[
                  styles.unitButton,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                  showTimeAs === unit && styles.unitButtonActive,
                  showTimeAs === unit && { backgroundColor: colors.primary, borderColor: colors.primary },
                ]}
                onPress={() => setShowTimeAs(unit)}
                accessibilityRole="button"
                accessibilityLabel={`Select ${unit}`}
              >
                <Text
                  style={[
                    styles.unitButtonText,
                    { color: colors.text },
                    showTimeAs === unit && styles.unitButtonTextActive,
                    showTimeAs === unit && { color: '#FFFFFF' },
                  ]}
                >
                  {unit}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
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
  dateIcon: {
    fontSize: 18,
    marginLeft: 8,
  },
  unitContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  unitButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  unitButtonActive: {
    // Colors applied inline
  },
  unitButtonText: {
    fontSize: 14,
    textTransform: 'capitalize',
  },
  unitButtonTextActive: {
    // Colors applied inline
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
});

