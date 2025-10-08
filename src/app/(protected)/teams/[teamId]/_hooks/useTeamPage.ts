// src/app/(protected)/teams/[teamId]/hooks/useTeamsPage.ts
// OR add this to the existing hook.ts file

"use client";

import { useMemo } from "react";
import type { TeamLocal, StatLocal } from "../types";

/**
 * Hook for managing the teams list page state and logic
 */
export function useTeamsPage(
  initialTeams: TeamLocal[],
  initialStats: StatLocal[]
) {
  // Return the initial data and helper functions
  const stats = useMemo(() => initialStats, [initialStats]);
  const teams = useMemo(() => initialTeams, [initialTeams]);

  /**
   * Returns the Tailwind color class for a department
   */
  const getDepartmentColor = (department: string): string => {
    const colors: Record<string, string> = {
      Engineering: "bg-blue-500",
      Design: "bg-purple-500",
      Marketing: "bg-green-500",
      Sales: "bg-yellow-500",
      HR: "bg-pink-500",
      Finance: "bg-indigo-500",
      Operations: "bg-orange-500",
      Support: "bg-teal-500",
    };

    return colors[department] || "bg-gray-500";
  };

  return {
    stats,
    teams,
    getDepartmentColor,
  };
}