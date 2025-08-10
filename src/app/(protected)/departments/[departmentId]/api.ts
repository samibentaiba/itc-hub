import type { Department, Ticket } from "./types";
import mockDepartments from "./mock.json";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function fetchDepartment(departmentId: string): Promise<Department | null> {
  await delay(500);

  const departmentData = (mockDepartments as any[]).find(
    (dept) => dept.id === departmentId
  );
  
  if (!departmentData) {
    return null;
  }
  
  const ticketsWithDates: Ticket[] = (departmentData.tickets || []).map((ticket: Ticket) => ({
    ...ticket,
    calendarDate: new Date(ticket.calendarDate),
  }));

  const department: Department = {
    ...departmentData,
    teams: departmentData.teams || [],
    tickets: ticketsWithDates,
    members: departmentData.members || [],
    events: departmentData.events || [], // Ensure events are passed
    upcomingEvents: departmentData.upcomingEvents || [], // Ensure upcoming events are passed
  };

  return department;
}
