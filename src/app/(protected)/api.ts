// src/app/(protected)/api.ts
import mockData from './mock.json';
import * as T from './types';

const MOCK_API_DELAY = 500; // ms

const simulateDelay = () => new Promise(res => setTimeout(res, MOCK_API_DELAY));

// Dashboard
export const getDashboardData = async (): Promise<T.DashboardData> => {
  await simulateDelay();
  return mockData.dashboard as T.DashboardData;
};

// Calendar
export const getCalendarData = async (): Promise<T.CalendarData> => {
  await simulateDelay();
  return mockData.calendar as T.CalendarData;
};

// Departments
export const getDepartments = async (): Promise<T.DepartmentsPageData> => {
    await simulateDelay();
    return mockData.departments as T.DepartmentsPageData;
}

export const getDepartmentById = async (id: string): Promise<T.DepartmentDetailData | undefined> => {
    await simulateDelay();
    // In a real app, you'd fetch this from an API: /api/departments/${id}
    // The current mock implementation only has one detail object. We return it if the ID matches.
    const department = (mockData.departmentDetail as T.DepartmentDetailData).id === id ? mockData.departmentDetail : undefined;
    // Casting to 'unknown' to bypass type errors from incomplete mock data structures.
    return department as unknown as T.DepartmentDetailData | undefined;
}

// Teams
export const getTeams = async (): Promise<T.TeamsPageData> => {
    await simulateDelay();
    return mockData.teams as T.TeamsPageData;
}

export const getTeamById = async (id: string): Promise<T.TeamDetailData | undefined> => {
    await simulateDelay();
    const team = (mockData.teamDetail as T.TeamDetailData).id === id ? mockData.teamDetail : undefined;
    // Casting to 'unknown' to bypass type errors from incomplete mock data structures.
    return team as unknown as T.TeamDetailData | undefined;
}

// Tickets
export const getTickets = async (): Promise<T.TicketsPageData> => {
    await simulateDelay();
    return mockData.tickets as T.TicketsPageData;
}

export const getTicketById = async (id: string): Promise<T.TicketDetails | undefined> => {
    await simulateDelay();
    const ticket = (mockData.ticketDetail as T.TicketDetails).id === id ? mockData.ticketDetail : undefined;
    // Casting to 'unknown' to bypass type errors from incomplete mock data structures.
    return ticket as unknown as T.TicketDetails | undefined;
}

// Users
export const getUsers = async (): Promise<T.UsersPageData> => {
    await simulateDelay();
    return mockData.users as T.UsersPageData;
}

export const getUserById = async (id: string): Promise<T.UserDetailData | undefined> => {
    await simulateDelay();
    const user = (mockData.userDetail as T.UserDetailData).id === id ? mockData.userDetail : undefined;
    // Casting to 'unknown' to bypass type errors from incomplete mock data structures.
    return user as unknown as T.UserDetailData | undefined;
}

// Profile
export const getProfileData = async (): Promise<T.Profile> => {
    await simulateDelay();
    return mockData.profile as T.Profile;
}

// Settings
export const getSettingsData = async (): Promise<T.SettingsData> => {
    await simulateDelay();
    return mockData.settings as T.SettingsData;
}
