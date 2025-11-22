/**
 * Root navigation stack parameter list
 */
export type RootStackParamList = {
  Home: undefined;
  EventDetail: { eventId: string };
  EditEvent: { eventId?: string };
  Settings: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

