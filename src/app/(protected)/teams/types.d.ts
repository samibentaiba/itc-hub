import { type LucideIcon } from "lucide-react";

// Defines the structure for a single team.
export interface Team {
  id: string;
  name: string;
  description: string;
  department: string;
  memberCount: number;
  activeProjects: number;
  lead: {
    name: string;
    avatar: string;
    id: string;
  };
  members: {
    name: string;
    avatar: string;
    id: string;
  }[];
  recentActivity: string;
  status: "active" | "inactive";
}

// Defines the structure for a single stat card.
export interface TeamStat {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon; // We can keep the icon here for the client
  trend: string;
}
