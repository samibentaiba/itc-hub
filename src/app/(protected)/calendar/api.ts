// /calendar/api.ts

import { type Event, type UpcomingEvent } from "./types";
import data from "./mock.json";

/**
 * Simulates fetching calendar events from an API.
 * Includes a delay to mimic real-world network latency.
 * @returns A promise that resolves to an array of events.
 */
export const fetchEvents = async (): Promise<Event[]> => {
  console.log("Fetching calendar events...");
  await new Promise(resolve => setTimeout(resolve, 600)); // Simulate network delay
  console.log("Fetched calendar events.");
  return data.events as Event[];
};

/**
 * Simulates fetching upcoming events from a separate, faster API endpoint.
 * @returns A promise that resolves to an array of upcoming events.
 */
export const fetchUpcomingEvents = async (): Promise<UpcomingEvent[]> => {
  console.log("Fetching upcoming events...");
  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate faster network delay
  console.log("Fetched upcoming events.");
  return data.upcomingEvents as UpcomingEvent[];
};
