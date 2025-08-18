import DepartmentsClientPage from "./client";
import { headers } from 'next/headers';
import type { Department, Team } from "../types";

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

// This is the Server Component.
// Its only job is to fetch data on the server.
export default async function DepartmentsPage() {
  // Fetch departments data directly from API
  const response = await authenticatedFetch('/api/departments');
  if (!response.ok) {
    throw new Error('Failed to fetch departments');
  }
  const data = await response.json();
  const departments = data.departments;

  // Generate stats from the departments data
  const stats = [
    {
      title: "Total Departments",
      value: departments.length.toString(),
      description: "Active departments",
      trend: "+2 this quarter",
      icon: "building"
    },
    {
      title: "Total Teams",
      value: departments.reduce((sum: number, dept: Partial<Department>) => sum + (dept.teams?.length || 0), 0).toString(),
      description: "Across all departments",
      trend: "+3 this month",
      icon: "users"
    },
    {
      title: "Total Members",
      value: departments.reduce((sum: number, dept: Partial<Department>) => sum + (dept.memberCount || 0), 0).toString(),
      description: "Active employees",
      trend: "+12 this quarter",
      icon: "user"
    },
    {
      title: "Open Positions",
      value: "7",
      description: "Currently hiring",
      trend: "+2 this week",
      icon: "briefcase"
    }
  ];

  // Transform departments to match the expected format
  const transformedDepartments = departments.map((dept: Partial<Department>) => ({
    id: dept.id || '',
    name: dept.name || '',
    description: dept.description || '',
    head: {
      name: dept.manager?.name || 'Unknown',
      avatar: dept.manager?.avatar || '',
      id: dept.manager?.id || ''
    },
    teamCount: dept.teams?.length || 0,
    memberCount: dept.memberCount || 0,
    status: "active" as const,
    recentActivity: "Recent activity",
    color: "#3b82f6",
    teams: dept.teams?.map((team: Partial<Team>) => ({
      name: team.name || '',
      memberCount: team.memberCount || 0
    })) || []
  }));

  // Pass the fetched data as props to the Client Component.
  return (
    <DepartmentsClientPage 
      initialDepartments={transformedDepartments} 
      initialStats={stats} 
    />
  );
}
