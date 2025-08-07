
/*
================================================================================
|                                   api.ts                                     |
================================================================================
| Description:                                                                 |
| This server-side module handles fetching data for a specific user. The       |
| `fetchUserById` function simulates an API call to retrieve a single user's   |
| profile from the `mock.json` data source based on the provided ID.           |
================================================================================
*/
import { type User } from "./types";
import data from "./mock.json";

// Type assertion for the mock data to ensure it matches our expected structure.
const usersData = data as Record<string, User>;

/**
 * Simulates fetching a single user's profile by their ID.
 * @param userId - The ID of the user to fetch.
 * @returns A promise that resolves to the user object, or null if not found.
 */
export const fetchUserById = async (userId: string): Promise<User | null> => {
  // Simulate network delay for a realistic loading experience.
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const user = usersData[userId];
  
  return user || null;
};
