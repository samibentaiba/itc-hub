
import UsersClientPage from "./client";
import { headers } from 'next/headers';

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
  const users = data.users;

  // Transform users to match the expected format
  const transformedUsers = users.map(user => ({
    id: user.id || '',
    name: user.name || '',
    email: user.email || '',
    avatar: user.avatar || '',
    role: user.role || 'user',
    department: user.department || '',
    status: "Active" as "Active" | "Away" | "Offline",
    lastActive: "Just now",
    projects: Math.floor(Math.random() * 10) + 1
  }));

  // Generate stats from the users data
  const stats = [
    {
      title: "Total Users",
      value: users.length.toString(),
      description: "Active employees",
      trend: "+12 this quarter"
    },
    {
      title: "New Users",
      value: "8",
      description: "This month",
      trend: "+3 this week"
    },
    {
      title: "Active Now",
      value: "89",
      description: "Currently online",
      trend: "+5 from yesterday"
    },
    {
      title: "Teams",
      value: "24",
      description: "Total teams",
      trend: "+2 this month"
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
