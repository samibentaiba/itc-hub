import TeamsClientPage from "./client";
import { fetchTeams, fetchTeamStats } from "./api";

// This is the Server Component.
// Its only job is to fetch data on the server.
export default async function TeamsPage() {
  // Fetch the initial data in parallel.
  const [teams, stats] = await Promise.all([
    fetchTeams(),
    fetchTeamStats()
  ]);

  // Pass the fetched data as props to the Client Component.
  return (
    <TeamsClientPage 
      initialTeams={teams} 
      initialStats={stats} 
    />
  );
}
