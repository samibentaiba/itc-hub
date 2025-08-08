/**
 * types.d.ts
 *
 * This file contains all the shared type definitions for the /departments feature.
 * By centralizing types, we ensure consistency across the API, server components, and client components.
 */

/**
 * Defines the structure for a single statistic card.
 */
export interface DepartmentStat {
  title: string;
  value: string;
  description: string;
  trend: string;
}

/**
 * Defines the structure for a team that belongs to a department.
 */
export interface Team {
  name: string;
  memberCount: number;
}

/**
 * Defines the main structure for a Department object.
 */
export interface Department {
  id: string;
  name: string;
  description: string;
  head: {
    name: string;
    avatar: string;
    id: string;
  };
  teamCount: number;
  memberCount: number;
  status: "active" | "inactive"; // Made status more specific
  recentActivity: string;
  color: string; // Added color property used in the UI
  teams: Team[];
}
