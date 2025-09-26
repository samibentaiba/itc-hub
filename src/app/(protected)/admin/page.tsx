// /admin/page.tsx

import { redirect } from "next/navigation";
import AdminClientPage from "./client";
import { headers } from 'next/headers';
import { getAuthenticatedUser, isAdmin } from "@/lib/auth-helpers";
import type { User, Team, Department, CalendarEvent } from "@/app/(protected)/types";

// Helper function for authenticated server-side fetch requests
async function authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const headersList = await headers();
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

export default async function AdminPage() {
  // Check if user has admin role
  // 🔹 Get user from session
  const user = await getAuthenticatedUser();
  const isAdminUser = await isAdmin(user?.user.id || '');
  if(!isAdminUser) redirect('/')
    
  // Fetch data using direct API calls
  const [usersResponse, teamsResponse, departmentsResponse, eventsResponse, pendingEventsResponse] = await Promise.all([
    authenticatedFetch('/api/admin/users'),
    authenticatedFetch('/api/admin/teams'),
    authenticatedFetch('/api/admin/departments'),
    authenticatedFetch('/api/admin/events'),
    authenticatedFetch('/api/admin/events/requests'),
  ]);

  // Parse all responses
  const [usersData, teamsData, departmentsData, eventsData, pendingEventsData] = await Promise.all([
    usersResponse.ok ? usersResponse.json() : Promise.resolve({ users: [] }),
    teamsResponse.ok ? teamsResponse.json() : Promise.resolve({ teams: [] }),
    departmentsResponse.ok ? departmentsResponse.json() : Promise.resolve({ departments: [] }),
    eventsResponse.ok ? eventsResponse.json() : Promise.resolve({ events: [] }),
    pendingEventsResponse.ok ? pendingEventsResponse.json() : Promise.resolve({ events: [] }),
  ]);

  const users = usersData.users || [];
  const teams = teamsData.teams || [];
  const departments = departmentsData.departments || [];
  const events = eventsData.events || [];
  const pendingEvents = pendingEventsData.events || [];

  // Transform data for admin interface
  // NOTE: This transformation logic is temporary. The UI will be updated to use the raw API response directly.
  const initialUsers = users.map((user: any) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    status: user.status,
    joinedDate: user.createdAt,
    avatar: user.avatar || `https://i.pravatar.cc/150?u=${user.id}`,
    role: user.role.toLowerCase(),
  }));

  const initialTeams = teams.map((team: any) => ({
    id: team.id,
    name: team.name,
    description: team.description,
    members: [], // This will be populated client-side or via a more detailed API call
    departmentId: team.departmentId,
    createdDate: team.createdAt,
    status: "active",
  }));

  const initialDepartments = departments.map((dept: any) => ({
    id: dept.id,
    name: dept.name,
    description: dept.description,
    members: [], // This will be populated client-side or via a more detailed API call
    teams: [], // This will be populated client-side or via a more detailed API call
    createdDate: dept.createdAt,
    status: "active",
  }));

  const initialEvents = events.map((event: any) => ({
    id: event.id,
    title: event.title,
    description: event.description,
    date: new Date(event.date).toISOString().split('T')[0],
    time: event.time || '00:00',
    duration: event.duration,
    type: event.type.toLowerCase(),
    attendees: [], // This needs a proper relation in the API response
    location: event.location || 'N/A',
    color: '#3b82f6', // Example color
  }));
  
  const initialPendingEvents = pendingEvents.map((event: any) => ({
    ...event,
    date: new Date(event.date).toISOString().split('T')[0],
    submittedBy: 'Unknown', // This data is not yet available from the API
    submittedByType: 'user', // This data is not yet available from the API
  }));

  // TODO: Fetch upcoming events separately if logic differs from all events
  const upcomingEvents = initialEvents.slice(0, 5).map((e:any) => ({ ...e, attendees: e.attendees.length }));

  return (
    <AdminClientPage
      initialUsers={initialUsers}
      initialTeams={initialTeams}
      initialDepartments={initialDepartments}
      initialEvents={initialEvents}
      initialUpcomingEvents={upcomingEvents}
      initialPendingEvents={initialPendingEvents}
    />
  );
}
