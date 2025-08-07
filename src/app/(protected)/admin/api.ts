// --- /admin/api.ts ---
import type { User, Team, Department } from "./types";
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