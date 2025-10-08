// _components/TeamsGrid.tsx
"use client";

import { TeamCard } from "./TeamCard";
import type { TeamLocal } from "./../types";

interface TeamsGridProps {
  teams: TeamLocal[];
  getDepartmentColor: (department: string) => string;
}

/**
 * Grid component for displaying team cards.
 * Renders a responsive grid layout of team cards.
 * 
 * @param teams - Array of teams to display.
 * @param getDepartmentColor - Function to get the color class for a department.
 */
export function TeamsGrid({ teams, getDepartmentColor }: TeamsGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {teams.map((team) => (
        <TeamCard 
          key={team.id} 
          team={team} 
          getDepartmentColor={getDepartmentColor} 
        />
      ))}
    </div>
  );
}