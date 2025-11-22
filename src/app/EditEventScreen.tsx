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
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useEventsStore } from '@/features/events/eventsStore';
import { TIME_UNITS, DEFAULT_TIME_UNIT } from '@/config/constants';
import { colors } from '@/theme';
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
    navigation.setOptions({
      title: isEditing ? 'Edit Event' : 'New Event',
    });
  }, [isEditing, navigation]);

  const handleSave = async () => {
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
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter event title"
            accessibilityLabel="Event title"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Enter event description (optional)"
            multiline
            numberOfLines={4}
            accessibilityLabel="Event description"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Start Date</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
            accessibilityRole="button"
            accessibilityLabel="Select start date"
            activeOpacity={0.7}
          >
            <Text style={styles.dateText}>
              {startDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
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
            themeVariant="light"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Show Time As</Text>
          <View style={styles.unitContainer}>
            {TIME_UNITS.map((unit) => (
              <TouchableOpacity
                key={unit}
                style={[
                  styles.unitButton,
                  showTimeAs === unit && styles.unitButtonActive,
                ]}
                onPress={() => setShowTimeAs(unit)}
                accessibilityRole="button"
                accessibilityLabel={`Select ${unit}`}
              >
                <Text
                  style={[
                    styles.unitButtonText,
                    showTimeAs === unit && styles.unitButtonTextActive,
                  ]}
                >
                  {unit}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={isLoading}
          accessibilityRole="button"
          accessibilityLabel="Save event"
        >
          <Text style={styles.saveButtonText}>
            {isLoading ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
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
    color: colors.text.primary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.background.primary,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateButton: {
    backgroundColor: colors.background.primary,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border.default,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    color: colors.text.primary,
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
    backgroundColor: colors.background.primary,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  unitButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  unitButtonText: {
    fontSize: 14,
    color: colors.text.primary,
    textTransform: 'capitalize',
  },
  unitButtonTextActive: {
    color: colors.text.inverse,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: colors.text.inverse,
    fontSize: 16,
    fontWeight: '600',
  },
});

