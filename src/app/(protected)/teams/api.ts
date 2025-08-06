import { type Team, type TeamStat } from "./types";
import data from "./mock.json";

// Icon imports and the iconMap are removed from the server-side API.

/**
 * Simulates fetching team data from an API.
 * @returns A promise that resolves to an array of teams.
 */
export const fetchTeams = async (): Promise<Team[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return data.teams as Team[];
};

/**
 * Simulates fetching statistics data from an API.
 * This function now only returns plain, serializable data.
 * @returns A promise that resolves to an array of team stats.
 */
export const fetchTeamStats = async (): Promise<TeamStat[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  // Returns the raw stats data directly from the JSON file.
  return data.stats as TeamStat[];
};
