// api.ts

import { Department, Ticket } from "./types"; // Import the shared types
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
  const departmentData = (mockDepartments as any[]).find(
    (dept) => dept.id === departmentId
  );

  // Return null if the department isn't found
  if (!departmentData) {
    return null;
  }
  
  // Parse ticket calendarDate strings into Date objects to match the Ticket type
  const ticketsWithDates: Ticket[] = (departmentData.tickets || []).map((ticket: any) => ({
    ...ticket,
    calendarDate: new Date(ticket.calendarDate),
  }));

  // Construct the final department object with correctly typed tickets and members
  const department: Department = {
    ...departmentData,
    teams: departmentData.teams || [],
    tickets: ticketsWithDates,
    members: departmentData.members || [] // This line was missing
  };

  return department;
}
