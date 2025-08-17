import UsersClientPage from "./client";
import { headers } from 'next/headers';

interface TransformedApiUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  status: string; // This is the status from the DB, e.g., "verified"
  createdAt: Date;
  department: string; // This is the transformed department name
  teamCount: number;
  ticketsAssigned: number;
  ticketsCreated: number;
  completedTickets: number;
}

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

// This is a Server Component. 
// It fetches data on the server and passes it to the client component.
export default async function UsersPage() {
  // Fetch users data directly from API
  const response = await authenticatedFetch('/api/users');
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  const data = await response.json();
  const users: TransformedApiUser[] = data.users;

  // Transform users to match the expected format
  const transformedUsers = users.map((user: TransformedApiUser) => ({
    id: user.id || '',
    name: user.name || '',
    email: user.email || '',
    avatar: user.avatar || `/avatars/${user.name.toLowerCase().replace(' ', '')}.png`,
    role: user.role?.toLowerCase() || 'user',
    department: user.department || 'Unassigned',
    status: "Active" as const,
    lastActive: "Just now",
    projects: Math.floor(Math.random() * 10) + 1
  }));

  // Calculate real stats from the users data
  const totalUsers = users.length;
  const activeUsers = users.filter((user: TransformedApiUser) => user.status === 'verified').length;
  const adminUsers = users.filter((user: TransformedApiUser) => user.role === 'ADMIN').length;
  const managerUsers = users.filter((user: TransformedApiUser) => user.role === 'MANAGER').length;
  
  const stats = [
    {
      title: "Total Users",
      value: totalUsers.toString(),
      description: "All registered users",
      trend: "+12 this quarter"
    },
    {
      title: "Active Users", 
      value: activeUsers.toString(),
      description: "Verified accounts",
      trend: "+3 this week"
    },
    {
      title: "Managers",
      value: managerUsers.toString(),
      description: "Management level",
      trend: "+1 this month"
    },
    {
      title: "Admins",
      value: adminUsers.toString(),
      description: "System administrators", 
      trend: "No change"
    }
  ];

  // Pass the server-fetched data as props to the client component.
  return (
    <UsersClientPage 
      initialUsers={transformedUsers} 
      initialStats={stats} 
    />
  );
}