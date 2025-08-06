// Importing the necessary types and data
import { type Ticket, type Stat } from "./types";
import data from "./mock.json";

/**
 * Simulates fetching ticket data from an API.
 * @returns A promise that resolves to an array of tickets.
 */
export const fetchTickets = async (): Promise<Ticket[]> => {
  // Simulate a network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return the tickets from the mock data
  // The 'as' keyword is used for type assertion, telling TypeScript
  // to trust that the data conforms to the Ticket[] type.
  return data.tickets as Ticket[];
};

/**
 * Simulates fetching statistics data from an API.
 * @returns A promise that resolves to an array of stats.
 */
export const fetchStats = async (): Promise<Stat[]> => {
  // Simulate a network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Return the stats from the mock data
  // Type assertion is used here as well.
  return data.stats as Stat[];
};
