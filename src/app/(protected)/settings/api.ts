import { type UserSettings } from "./types";
import data from "./mock.json";

/**
 * Simulates fetching user settings from an API.
 * In a real application, this would fetch data for the currently logged-in user.
 * @returns A promise that resolves to the UserSettings object.
 */
export const fetchUserSettings = async (): Promise<UserSettings> => {
  // Simulate a network delay to make loading states visible
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return the settings from the mock data
  return data.settings as UserSettings;
};
