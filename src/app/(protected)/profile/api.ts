// ===== IMPROVED api.ts =====
// src/app/(protected)/profile/api.ts
import { type ProfileData } from "./types";
import data from "./mock.json";

export const fetchProfileData = async (): Promise<ProfileData | null> => {
  try {
    // Simulate network delay for realistic loading experience
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Validate data structure before returning
    const profileData = data as ProfileData;
    
    // Basic validation
    if (!profileData.profile?.name || !profileData.profile?.email) {
      throw new Error("Invalid profile data structure");
    }
    
    return profileData;
  } catch (error) {
    console.error("Failed to fetch profile data:", error);
    return null;
  }
};