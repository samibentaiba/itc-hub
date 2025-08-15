// /admin/page.tsx

import { redirect } from "next/navigation";
import AdminClientPage from "./client";
import { headers } from 'next/headers';
import { getAuthenticatedUser, isAdmin } from "@/lib/auth-helpers";

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
  const [usersResponse, teamsResponse, departmentsResponse, eventsResponse] = await Promise.all([
    authenticatedFetch('/api/users'),
    authenticatedFetch('/api/teams'),
    authenticatedFetch('/api/departments'),
    authenticatedFetch('/api/events?type=personal'),
  ]);

  // Parse all responses
  const [usersData, teamsData, departmentsData, eventsData] = await Promise.all([
    usersResponse.ok ? usersResponse.json() : Promise.resolve({ users: [] }),
    teamsResponse.ok ? teamsResponse.json() : Promise.resolve({ teams: [] }),
    departmentsResponse.ok ? departmentsResponse.json() : Promise.resolve({ departments: [] }),
    eventsResponse.ok ? eventsResponse.json() : Promise.resolve({ events: [] })
  ]);

  const users = usersData.users || [];
  const teams = teamsData.teams || [];
  const departments = departmentsData.departments || [];
  const events = eventsData.events || [];

  // Transform data for admin interface
  const initialUsers = users.map(user => ({
    id: user.id || '',
    name: user.name || '',
    email: user.email || '',
    status: "verified" as const,
    joinedDate: new Date().toISOString(),
    avatar: user.avatar || ''
  }));

  const initialTeams = teams.map(team => ({
    id: team.id || '',
    name: team.name || '',
    description: team.description || '',
    members: [],
    departmentId: 'dept-1',
    createdDate: new Date().toISOString(),
    status: "active" as const
  }));

  const initialDepartments = departments.map(dept => ({
    id: dept.id || '',
    name: dept.name || '',
    description: dept.description || '',
    members: [],
    teams: [],
    createdDate: new Date().toISOString(),
    status: "active" as const
  }));

  const initialEvents = events.slice(0, 10).map((event, index) => ({
    id: index + 1,
    title: event.title,
    description: event.description,
    date: event.start.split('T')[0],
    time: event.start.split('T')[1]?.split(':').slice(0, 2).join(':') || '09:00',
    duration: 60,
    type: "meeting" as const,
    attendees: event.participants?.map(p => p.name || '') || [],
    location: event.location || 'Conference Room',
    color: '#3b82f6'
  }));

  return (
    <AdminClientPage
      initialUsers={initialUsers}
      initialTeams={initialTeams}
      initialDepartments={initialDepartments}
      initialEvents={initialEvents}
      initialUpcomingEvents={initialEvents.slice(0, 5)}
      initialPendingEvents={initialEvents.slice(0, 3)}
    />
  );
}
