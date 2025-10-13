// src/app/(protected)/departments/types.ts

// Re-export types from parent
export type { DepartmentLocal } from "../types";
import type { DepartmentStatLocal } from "../types";
// Manager interface for department managers
export interface DepartmentManager {
  id: string;
  name: string;
  avatar: string;
}

// Team interface for department teams
export interface DepartmentTeam {
  name: string;
  memberCount: number;
}

// Extended Department interface with all required fields
export interface DepartmentWithDetails {
  id: string;
  name: string;
  description: string;
  head: {
    name: string;
    avatar: string;
    id: string;
  };
  managers: DepartmentManager[];
  teamCount: number;
  memberCount: number;
  status: "active" | "inactive";
  recentActivity: string;
  color: string;
  teams: DepartmentTeam[];
}

// Props interfaces
export interface DepartmentsClientPageProps {
  initialDepartments: DepartmentWithDetails[];
  initialStats: DepartmentStatLocal[];
}

export interface DepartmentsGridProps {
  departments: DepartmentWithDetails[];
}

export interface DepartmentCardProps {
  department: DepartmentWithDetails;
}

export interface DepartmentHeadProps {
  managers: DepartmentManager[];
}

export interface TeamsSectionProps {
  teams: DepartmentTeam[];
  teamCount: number;
}

export interface DepartmentStatsProps {
  memberCount: number;
  status: string;
}

export interface RecentActivityProps {
  activity: string;
}

export interface StatCardProps {
  stat: DepartmentStatLocal;
  Icon: React.ElementType;
}

// Icon map type
export type IconMapKey = 
  | "Total Departments" 
  | "Department Heads" 
  | "Teams per Dept" 
  | "Cross-Dept Projects";

// Hook return type
export interface UseDepartmentsPageReturn {
  stats: DepartmentStatLocal[];
  departments: DepartmentWithDetails[];
}