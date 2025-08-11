// src/app/(protected)/api.ts
import { mockData } from './mock'; // Imports from the typed mock.ts file
import * as T from './types';

const MOCK_API_DELAY = 500; // ms

const simulateDelay = () => new Promise(res => setTimeout(res, MOCK_API_DELAY));

// Dashboard
export const getDashboardData = async (): Promise<T.DashboardData> => {
  await simulateDelay();
  return mockData.dashboard;
};

// --- Calendar ---
// Gets the aggregated calendar for the current user (personal, team, department)
export const getPersonalCalendarData = async (): Promise<T.CalendarEvent[]> => {
  await simulateDelay();
  const { personalEvents, teamEvents, departmentEvents } = mockData.personalCalendar;
  return [...personalEvents, ...teamEvents, ...departmentEvents];
};

// Gets the global calendar with company-wide events
export const getGlobalCalendarData = async (): Promise<T.CalendarEvent[]> => {
  await simulateDelay();
  return mockData.globalCalendar.events;
};


// Departments
export const getDepartments = async (): Promise<T.DepartmentsPageData> => {
    await simulateDelay();
    return mockData.departments;
}

export const getDepartmentById = async (id: string): Promise<T.DepartmentDetailData | undefined> => {
    await simulateDelay();
    // In a real app, you would find the specific department from the list.
    return mockData.departmentDetail.id === id ? mockData.departmentDetail : undefined;
}

// Teams
export const getTeams = async (): Promise<T.TeamsPageData> => {
    await simulateDelay();
    return mockData.teams;
}

export const getTeamById = async (id: string): Promise<T.TeamDetailData | undefined> => {
    await simulateDelay();
    return mockData.teamDetail.id === id ? mockData.teamDetail : undefined;
}

// Tickets
export const getTickets = async (): Promise<T.TicketsPageData> => {
    await simulateDelay();
    return mockData.tickets;
}

export const getTicketById = async (id: string): Promise<T.TicketDetails | undefined> => {
    await simulateDelay();
    return mockData.ticketDetail.id === id ? mockData.ticketDetail : undefined;
}

// Users
export const getUsers = async (): Promise<T.UsersPageData> => {
    await simulateDelay();
    return mockData.users;
}

export const getUserById = async (id: string): Promise<T.UserDetailData | undefined> => {
    await simulateDelay();
    return mockData.userDetail.id === id ? mockData.userDetail : undefined;
}

// Profile
export const getProfileData = async (): Promise<T.Profile> => {
    await simulateDelay();
    return mockData.profile;
}

// Settings
export const getSettingsData = async (): Promise<T.SettingsData> => {
    await simulateDelay();
    return mockData.settings;
}
