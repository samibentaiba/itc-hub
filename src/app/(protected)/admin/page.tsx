// /admin/page.tsx

import { redirect } from "next/navigation";
import { getUsers, getTeams, getDepartments, getPersonalCalendarData, getUserRole } from "@/lib/data-services";
import AdminClientPage from "./client";

export default async function AdminPage() {
  // Check if user has admin role
  const userRole = await getUserRole();
  if (userRole !== "admin") {
    redirect("/dashboard");
  }

  // Fetch data using clean API functions
  const [users, teams, departments, events] = await Promise.all([
    getUsers(),
    getTeams(), 
    getDepartments(),
    getPersonalCalendarData(),
  ]);

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
