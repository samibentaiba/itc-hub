// --- /calendar/global/api.ts ---
import type { GlobalEvent } from "./types";
import data from "./mock.json";

/**
 * Simulates fetching global calendar events from an API.
 */
export const fetchGlobalEvents = async (): Promise<GlobalEvent[]> => {
  console.log("Fetching global events...");
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
  // In a real app, you'd convert date strings to Date objects here
  return data.events.map(event => ({
    ...event,
    date: new Date(event.date),
  })) as GlobalEvent[];
};

