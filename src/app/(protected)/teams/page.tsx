import TeamsClientPage from "./client";
import { getTeams } from "../api";

// This is the Server Component.
// Its only job is to fetch data on the server.
export default async function TeamsPage() {
  // Fetch teams data
  const teams = await getTeams();

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
