import { type ProfileData } from "./types";
import data from "./mock.json";

/**
 * Simulates fetching the complete profile data for a user.
 * @returns A promise that resolves to the ProfileData object.
 */
export const fetchProfileData = async (): Promise<ProfileData> => {
  // Simulate a network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In a real app, you might fetch different parts of the profile
  // and assemble them here. For now, we return the whole mock object.
  return data as ProfileData;
};
