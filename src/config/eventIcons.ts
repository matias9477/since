/**
 * Common event icons for users to choose from
 * Uses Ionicons names that match common life events and tracking scenarios
 *
 * Icons are selected based on common things people track:
 * - How long they've maintained something (habits, relationships, health)
 * - How long since something meaningful happened (anniversaries, achievements)
 */
export const EVENT_ICONS = [
  { name: "heart" as const, label: "Love & Relationships" },
  { name: "fitness" as const, label: "Fitness & Exercise" },
  { name: "medical" as const, label: "Health & Medical" },
  { name: "school" as const, label: "Education & Learning" },
  { name: "briefcase" as const, label: "Career & Work" },
  { name: "home" as const, label: "Home & Family" },
  { name: "airplane" as const, label: "Travel & Adventure" },
  { name: "trophy" as const, label: "Achievements & Goals" },
  { name: "musical-notes" as const, label: "Hobbies & Interests" },
  { name: "leaf" as const, label: "Lifestyle & Habits" },
] as const;

export type EventIconName = (typeof EVENT_ICONS)[number]["name"];

/**
 * Gets the icon name by label (case-insensitive)
 */
export const getIconByName = (name: string): EventIconName | undefined => {
  return EVENT_ICONS.find((icon) => icon.name === name)?.name;
};

/**
 * Gets all available icon names
 */
export const getAvailableIconNames = (): EventIconName[] => {
  return EVENT_ICONS.map((icon) => icon.name);
};

/**
 * Gets icon label by name
 */
export const getIconLabel = (name: string): string | undefined => {
  return EVENT_ICONS.find((icon) => icon.name === name)?.label;
};
