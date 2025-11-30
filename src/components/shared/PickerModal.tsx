import React from "react";
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/theme";

export interface PickerOption<T> {
  value: T;
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  renderCustom?: (isSelected: boolean, colors: any) => React.ReactNode;
}

interface PickerModalProps<T> {
  visible: boolean;
  title: string;
  options: PickerOption<T>[];
  selectedValue: T | null;
  onSelect: (value: T) => void;
  onClose: () => void;
  maxHeight?: string | number;
  showScrollView?: boolean;
}

/**
 * Reusable picker modal component for selecting from a list of options
 * Used for icon picker, time unit picker, and other selection modals
 */
export const PickerModal = <T,>({
  visible,
  title,
  options,
  selectedValue,
  onSelect,
  onClose,
  maxHeight = "80%",
  showScrollView = true,
}: PickerModalProps<T>): React.ReactElement => {
  const { colors } = useTheme();
  
  // Convert string percentage to number for maxHeight style
  const maxHeightValue: number | undefined = 
    typeof maxHeight === 'string' && maxHeight.endsWith('%')
      ? undefined // Let the ScrollView handle percentage via contentContainerStyle
      : typeof maxHeight === 'number' 
        ? maxHeight 
        : undefined;

  const handleSelect = (value: T) => {
    onSelect(value);
    onClose();
  };

  const isSelected = (value: T): boolean => {
    return value === selectedValue;
  };

  const content = (
    <View style={styles.modalOptions}>
      <View style={styles.modalOptionsContent}>
        {options.map((option, index) => {
          const selected = isSelected(option.value);
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionItem,
                selected && {
                  backgroundColor: colors.primary + "20",
                },
              ]}
              onPress={() => handleSelect(option.value)}
              accessibilityRole="button"
              accessibilityLabel={option.label}
              accessibilityState={{ selected }}
              activeOpacity={0.7}
            >
              {option.renderCustom ? (
                option.renderCustom(selected, colors)
              ) : (
                <>
                  <View style={styles.optionContent}>
                    {option.icon && (
                      <Ionicons
                        name={option.icon}
                        size={20}
                        color={selected ? colors.primary : colors.text}
                      />
                    )}
                    <Text
                      style={[
                        styles.optionText,
                        {
                          color: selected ? colors.primary : colors.text,
                          marginLeft: option.icon ? 12 : 0,
                        },
                      ]}
                    >
                      {option.label}
                    </Text>
                  </View>
                  {selected && (
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color={colors.primary}
                    />
                  )}
                </>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.modalContainer}>
          <SafeAreaView edges={["bottom"]}>
            <View
              style={[
                styles.modalContent,
                { 
                  backgroundColor: colors.surface, 
                  ...(maxHeightValue !== undefined && { maxHeight: maxHeightValue }),
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
                {title}
              </Text>
              <TouchableOpacity
                onPress={onClose}
                accessibilityRole="button"
                accessibilityLabel={`Close ${title.toLowerCase()}`}
              >
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            {showScrollView ? (
              <ScrollView
                style={styles.modalOptions}
                contentContainerStyle={styles.modalOptionsContent}
                showsVerticalScrollIndicator={false}
              >
                {options.map((option, index) => {
                  const selected = isSelected(option.value);
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.optionItem,
                        selected && {
                          backgroundColor: colors.primary + "20",
                        },
                      ]}
                      onPress={() => handleSelect(option.value)}
                      accessibilityRole="button"
                      accessibilityLabel={option.label}
                      accessibilityState={{ selected }}
                      activeOpacity={0.7}
                    >
                      {option.renderCustom ? (
                        option.renderCustom(selected, colors)
                      ) : (
                        <>
                          <View style={styles.optionContent}>
                            {option.icon && (
                              <Ionicons
                                name={option.icon}
                                size={20}
                                color={selected ? colors.primary : colors.text}
                              />
                            )}
                            <Text
                              style={[
                                styles.optionText,
                                {
                                  color: selected ? colors.primary : colors.text,
                                  marginLeft: option.icon ? 12 : 0,
                                },
                              ]}
                            >
                              {option.label}
                            </Text>
                          </View>
                          {selected && (
                            <Ionicons
                              name="checkmark"
                              size={20}
                              color={colors.primary}
                            />
                          )}
                        </>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            ) : (
              content
            )}
            </View>
          </SafeAreaView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    maxHeight: "95%",
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    minHeight: 400,
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
  modalOptions: {
    flex: 1,
  },
  modalOptionsContent: {
    padding: 16,
    paddingBottom: 32,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 8,
    marginVertical: 4,
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  optionText: {
    fontSize: 16,
    fontWeight: "500",
    textTransform: "capitalize",
  },
});

