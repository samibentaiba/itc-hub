// Defines the structure for the user settings object.
export interface UserSettings {
  displayName: string;
  email: string;
  notifications: boolean;
  // The theme setting is handled by next-themes and doesn't need to be in this data object.
}
