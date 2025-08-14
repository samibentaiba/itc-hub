// src/app/(protected)/api.ts
import { headers } from 'next/headers';
import * as T from './types';

// Helper function for authenticated server-side fetch requests
async function authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const headersList = headers();
  const cookie = headersList.get('cookie');
  
  return fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(cookie && { Cookie: cookie }),
      ...options.headers,
    },
  });
}

// Dashboard
export const getDashboardData = async (): Promise<T.DashboardData> => {
  const response = await authenticatedFetch('/api/dashboard');
  
  if (!response.ok) {
    throw new Error('Failed to fetch dashboard data');
  }
  
  return response.json();
};

// Calendar
export const getPersonalCalendarData = async (): Promise<T.CalendarEvent[]> => {
  const response = await authenticatedFetch('/api/events?type=personal');
  
  if (!response.ok) {
    throw new Error('Failed to fetch personal calendar data');
  }
  
  const data = await response.json();
  return data.events || [];
};

export const getGlobalCalendarData = async (): Promise<T.CalendarEvent[]> => {
  const response = await authenticatedFetch('/api/events?type=global');
  
  if (!response.ok) {
    throw new Error('Failed to fetch global calendar data');
  }
  
  const data = await response.json();
  return data.events || [];
};

// Departments
export const getDepartments = async (): Promise<T.DepartmentsPageData> => {
  const response = await authenticatedFetch('/api/departments');
  
  if (!response.ok) {
    throw new Error('Failed to fetch departments');
  }
  
  const data = await response.json();
  return data.departments;
};

export const getDepartmentById = async (id: string): Promise<T.DepartmentDetailData | undefined> => {
  const response = await authenticatedFetch(`/api/departments/${id}`);
  
  if (!response.ok) {
    if (response.status === 404) {
      return undefined;
    }
    throw new Error('Failed to fetch department');
  }
  
  return response.json();
};

// Teams
export const getTeams = async (): Promise<T.TeamsPageData> => {
  const response = await authenticatedFetch('/api/teams');
  
  if (!response.ok) {
    throw new Error('Failed to fetch teams');
  }
  
  const data = await response.json();
  return data.teams;
};

export const getTeamById = async (id: string): Promise<T.TeamDetailData | undefined> => {
  const response = await authenticatedFetch(`/api/teams/${id}`);
  
  if (!response.ok) {
    if (response.status === 404) {
      return undefined;
    }
    throw new Error('Failed to fetch team');
  }
  
  return response.json();
};

// Tickets
export const getTickets = async (): Promise<T.TicketsPageData> => {
  const response = await authenticatedFetch('/api/tickets');
  
  if (!response.ok) {
    throw new Error('Failed to fetch tickets');
  }
  
  return response.json();
};

export const getTicketById = async (id: string): Promise<T.TicketDetails | undefined> => {
  const response = await authenticatedFetch(`/api/tickets/${id}`);
  
  if (!response.ok) {
    if (response.status === 404) {
      return undefined;
    }
    throw new Error('Failed to fetch ticket');
  }
  
  return response.json();
};

// Users
export const getUsers = async (): Promise<T.UsersPageData> => {
  const response = await authenticatedFetch('/api/users');
  
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  
  const data = await response.json();
  return data.users;
};

export const getUserById = async (id: string): Promise<T.UserDetailData | undefined> => {
  const response = await authenticatedFetch(`/api/users/${id}`);
  
  if (!response.ok) {
    if (response.status === 404) {
      return undefined;
    }
    throw new Error('Failed to fetch user');
  }
  
  return response.json();
};

// Profile
export const getProfileData = async (): Promise<T.Profile> => {
  const response = await authenticatedFetch('/api/profile');
  
  if (!response.ok) {
    throw new Error('Failed to fetch profile data');
  }
  
  return response.json();
};

// Settings
export const getSettingsData = async (): Promise<T.SettingsData> => {
  const response = await authenticatedFetch('/api/settings');
  
  if (!response.ok) {
    throw new Error('Failed to fetch settings data');
  }
  
  return response.json();
};

// Auth
export const getUserRole = async (): Promise<string | null> => {
  try {
    const response = await authenticatedFetch('/api/auth/role');
    
    if (!response.ok) {
      throw new Error('Failed to fetch user role');
    }
    
    const data = await response.json();
    return data.role;
  } catch (error) {
    console.error("Failed to fetch user role:", error);
    return null;
  }
};


