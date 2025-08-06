// /dashboard/api.ts

import { type Ticket, type WorkspaceStats } from "./types";
import data from "./mock.json";

/**
 * Simulates fetching dashboard statistics from an API.
 * Includes a delay to mimic real-world network latency.
 * @returns A promise that resolves to the workspace stats.
 */
export const fetchWorkspaceStats = async (): Promise<WorkspaceStats> => {
  console.log("Fetching workspace stats...");
  await new Promise(resolve => setTimeout(resolve, 0)); // Simulate network delay
  console.log("Fetched workspace stats.");
  return data.stats as WorkspaceStats;
};

/**
 * Simulates fetching a list of assigned tickets from an API.
 * Includes a delay to mimic real-world network latency.
 * @returns A promise that resolves to an array of tickets.
 */
export const fetchTickets = async (): Promise<Ticket[]> => {
  console.log("Fetching tickets...");
  await new Promise(resolve => setTimeout(resolve, 800)); // Simulate a slightly longer delay
  console.log("Fetched tickets.");
  return data.tickets as Ticket[];
};
