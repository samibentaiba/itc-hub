// --- /admin/api.ts ---
import type { User, Team, Department,Event, UpcomingEvent,PendingEvent  } from "./types";
import data from "./mock.json";
import { headers } from "next/headers";
// Helper to construct the full URL for API requests
const getApiUrl = (path: string) => {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  return `${baseUrl}${path}`;
};


/**
 * Fetches the current user's role from the dedicated API endpoint.
 * This is used for server-side authorization checks.
 * @returns The user's role as a string (e.g., "ADMIN", "USER").
 */
export async function fetchRole(): Promise<string | null> {
  try {
    // We must forward the cookies from the original request to the API route
    // so that NextAuth can identify the user's session.
    const cookie = (await headers()).get("cookie");

    const response = await fetch(getApiUrl("/api/auth/role"), {
      headers: {
        // Pass the cookie to the API route
        cookie: cookie || "",
      },
      cache: 'no-store', // Always fetch the latest role
    });

    if (!response.ok) {
      // Handles 401 Unauthorized and other errors
      return null;
    }

    const data = await response.json();
    return data.role;
  } catch (error) {
    console.error("Failed to fetch user role:", error);
    return null;
  }
}

/**
 * Fetches all users.
 * The returned data conforms to the updated User type.
 */
export const fetchUsers = async (): Promise<User[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return data.users as User[];
};

/**
 * Fetches all teams.
 * The returned data conforms to the updated Team type.
 */
export const fetchTeams = async (): Promise<Team[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return data.teams as Team[];
};

/**
 * Fetches all departments.
 * The returned data conforms to the updated Department type.
 */
export const fetchDepartments = async (): Promise<Department[]> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  return data.departments as Department[];
};

// --- NEW: Calendar Functions ---
export const fetchEvents = async (): Promise<Event[]> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  return data.events as Event[];
};

export const fetchUpcomingEvents = async (): Promise<UpcomingEvent[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return data.upcomingEvents as UpcomingEvent[];
};

// --- NEW: Fetch Pending Events ---
export const fetchPendingEvents = async (): Promise<PendingEvent[]> => {
    await new Promise(resolve => setTimeout(resolve, 450));
    return data.pendingEvents as PendingEvent[];
};
