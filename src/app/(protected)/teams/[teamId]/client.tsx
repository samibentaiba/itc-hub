// client.tsx
"use client";

import { useTeamsPage } from "./_hooks/useTeamPage";
import type { TeamLocal, StatLocal } from "./types";
import { TeamsHeader } from "./_components/TeamHeader";
import { StatsGrid } from "./_components/StatsGrid";
import { TeamsGrid } from "./_components/TeamGrid";
import { EmptyState } from "./_components/EmptyState";


// The main data structure for the teams page.
// The API should return an object with this shape.
interface TeamsClientPageProps {
  initialTeams: TeamLocal[];
  initialStats: StatLocal[];
}

/**
 * The main client component for the teams page.
 * It fetches data on the server and passes it to this component.
 * This component then uses hooks to manage state and renders the UI.
 * 
 * @param initialTeams - The list of teams, fetched on the server.
 * @param initialStats - The statistics data for the teams overview.
 *                       The API should return an array of StatLocal objects.
 */
export default function TeamsClientPage({ initialTeams, initialStats }: TeamsClientPageProps) {
  // The useTeamsPage hook encapsulates the client-side logic for the page.
  const { stats, teams, getDepartmentColor } = useTeamsPage(initialTeams, initialStats);

  return (
    <div className="space-y-6">
      {/* The header component displays the page title and description. */}
      <TeamsHeader />

      {/* The stats grid displays overview statistics about teams. */}
      <StatsGrid stats={stats} />

      {/* The teams grid displays all team cards. */}
      <TeamsGrid teams={teams} getDepartmentColor={getDepartmentColor} />

      {/* Empty state shown when no teams are found. */}
      {teams.length === 0 && <EmptyState />}
    </div>
  );
}