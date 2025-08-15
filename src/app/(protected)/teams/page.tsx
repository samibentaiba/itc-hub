import TeamsClientPage from "./client";
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

// This is the Server Component.
// Its only job is to fetch data on the server.
export default async function TeamsPage() {
  // Fetch teams data directly from API
  const response = await authenticatedFetch('/api/teams');
  if (!response.ok) {
    throw new Error('Failed to fetch teams');
  }
  const data = await response.json();
  const teams = data.teams;

  // Generate stats from the teams data
  const stats = [
    {
      title: "Total Teams",
      value: teams.length.toString(),
      description: "Active teams",
      trend: "+3 this month"
    },
    {
      title: "Team Members",
      value: teams.reduce((sum, team) => sum + (team.memberCount || 0), 0).toString(),
      description: "Across all teams",
      trend: "+12 this quarter"
    },
    {
      title: "Active Projects",
      value: "42",
      description: "In progress",
      trend: "+8 this month"
    },
    {
      title: "Completed Projects",
      value: "89",
      description: "This year",
      trend: "+15 this quarter"
    }
  ];

  // Transform teams to match the expected format
  const transformedTeams = teams.map(team => ({
    id: team.id || '',
    name: team.name || '',
    description: team.description || '',
    department: team.department || '',
    memberCount: team.memberCount || 0,
    activeProjects: 3, // Default value
    lead: {
      name: team.leader?.name || 'Unknown',
      avatar: team.leader?.avatar || '',
      id: team.leader?.id || ''
    },
    members: team.members?.map(member => ({
      name: member.name || '',
      avatar: member.avatar || '',
      id: member.id || ''
    })) || [],
    recentActivity: "Recent team activity",
    status: "active" as const
  }));

  // Pass the fetched data as props to the Client Component.
  return (
    <TeamsClientPage 
      initialTeams={transformedTeams} 
      initialStats={stats} 
    />
  );
}
