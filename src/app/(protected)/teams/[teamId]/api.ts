import { type TeamDetail, type TeamTicket } from "./types";
import data from "./mock.json";

// Type assertion for the imported JSON data for better type safety
interface MockData {
  teams: Record<string, TeamDetail>;
  tickets: Record<string, TeamTicket[]>;
}
const mockData = data as MockData;

/**
 * Simulates fetching a single team's details by its ID.
 * @param teamId The ID of the team to fetch.
 * @returns A promise that resolves to a TeamDetail object, or null if not found.
 */
export const fetchTeamById = async (teamId: string): Promise<TeamDetail | null> => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
  const team = mockData.teams[teamId] || null;
  return team;
};

/**
 * Simulates fetching tickets associated with a specific team.
 * @param teamId The ID of the team for which to fetch tickets.
 * @returns A promise that resolves to an array of TeamTicket objects.
 */
export const fetchTicketsByTeamId = async (teamId: string): Promise<TeamTicket[]> => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
  const tickets = mockData.tickets[teamId] || [];
  return tickets;
};
