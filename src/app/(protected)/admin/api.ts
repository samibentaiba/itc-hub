// --- /admin/api.ts ---
import type { User, Team, Department,Event, UpcomingEvent,PendingEvent  } from "./types";
import data from "./mock.json";

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
