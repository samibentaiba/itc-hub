"use client";

// Imports for state and memoization are no longer needed.
import type { TeamLocal, StatLocal } from "../types";

// The hook is simplified to just manage the initial data and helper functions.
export function useTeamsPage(
  initialTeams: TeamLocal[],
  initialStats: StatLocal[]
) {
  // Helper function for department colors remains on the client
  const getDepartmentColor = (department: string) => {
    switch (department) {
      case "Engineering":
        return "bg-blue-500";
      case "Design":
        return "bg-purple-500";
      case "Infrastructure":
        return "bg-green-500";
      case "Quality Assurance":
        return "bg-orange-500";
      case "Product":
        return "bg-pink-500";
      default:
        return "bg-gray-500";
    }
  };

  return {
    stats: initialStats,
    teams: initialTeams, // Return the original, unfiltered list
    getDepartmentColor,
  };
}
