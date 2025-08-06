// api.ts

import { Department } from "./types"; // Import the shared type
import mockDepartments from "./mock.json"; // Import mock data array

// Helper function to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Fetches department details from a data source.
 * @param departmentId The ID of the department to fetch.
 * @returns A promise that resolves to the department data or null if not found.
 */
export async function fetchDepartment(departmentId: string): Promise<Department | null> {
  // Simulate network latency to demonstrate loading state
  await delay(1000);

  // In a real app, you would fetch from a database or external API
  const department = (mockDepartments as Department[]).find(
    (dept) => dept.id === departmentId
  );

  // Return the department if found, otherwise null
  return department || null;
}
