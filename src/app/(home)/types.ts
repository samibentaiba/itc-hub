// /app/(home)/types.d.ts

/**
 * Defines the structure for a single community statistic.
 */
export interface CommunityStat {
  count: number;
  change: string;
  trend: "up" | "down" | "stable";
}

/**
 * Defines the structure for the entire community statistics object.
 */
export interface CommunityStats {
  activeMembers: CommunityStat;
  activeProjects: CommunityStat;
  completedTasks: CommunityStat;
  successRate: CommunityStat;
}

/**
 * Defines the structure for a single achievement.
 */
export interface Achievement {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  year: string;
  category: "innovation" | "mentorship" | "excellence";
}

/**
 * Defines the structure for a single upcoming event.
 */
export interface UpcomingEvent {
  id: string;
  title: string;
  type: string;
  location: string;
  status: string;
  dueDate: string;
  registered: number;
  organizer: string;
  priority: "high" | "medium" | "low";
}

/**
 * A single interface to hold all data required by the landing page.
 */
export interface LandingPageData {
  stats: CommunityStats;
  achievements: Achievement[];
  events: UpcomingEvent[];
}
