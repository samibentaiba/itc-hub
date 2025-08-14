
import UsersClientPage from "./client";
import { getUsers } from "../api";

// This is a Server Component. 
// It fetches data on the server and passes it to the client component.
export default async function UsersPage() {
  // Fetch users data using the clean API
  const users = await getUsers();

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
