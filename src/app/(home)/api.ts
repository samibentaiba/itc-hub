// /app/(home)/api.ts

import type { LandingPageData } from "./types";
import data from "./mock.json";

/**
 * Simulates fetching all necessary data for the landing page from an API.
 * Includes a delay to mimic real-world network latency.
 */
export const fetchLandingPageData = async (): Promise<LandingPageData> => {
  console.log("Fetching landing page data...");
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
  console.log("Fetched landing page data.");
  return data as LandingPageData;
};