// src/app/(protected)/tickets/api.ts

// Importing the necessary types and data from the local feature folder.
import { type Ticket, type Stat } from "./types.d";
import data from "./mock.json";

/**
 * Simulates fetching ticket data from an API.
 * This function reads from the local mock.json file.
 * @returns A promise that resolves to an array of tickets.
 */
export const fetchTickets = async (): Promise<Ticket[]> => {
  // Simulate a network delay to mimic a real API call.
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return the tickets from the mock data.
  // The 'as' keyword is used for type assertion, telling TypeScript
  // to trust that the data from the JSON file conforms to the Ticket[] type.
  return data.tickets as Ticket[];
};

/**
 * Simulates fetching statistics data from an API.
 * This function reads from the local mock.json file.
 * @returns A promise that resolves to an array of stats.
 */
export const fetchStats = async (): Promise<Stat[]> => {
  // Simulate a network delay.
  await new Promise(resolve => setTimeout(resolve, 500));

  // Return the stats from the mock data.
  // Type assertion is used here as well.
  return data.stats as Stat[];
};
