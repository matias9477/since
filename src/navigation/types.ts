/**
 * Tab navigator parameter list
 */
export type TabParamList = {
  Home: undefined;
  Settings: undefined;
};

/**
 * Root navigation stack parameter list
 * MainTabs contains the tab navigator, other screens are stack screens
 */
export type RootStackParamList = {
  MainTabs: undefined;
  EventDetail: { eventId: string };
  EditEvent: { eventId?: string };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

