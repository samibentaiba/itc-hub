// /dashboard/types.d.ts

/**
 * Defines the structure for a single ticket object.
 * This ensures that all ticket data across the app is consistent.
 */
export interface Ticket {
  id: string;
  title: string;
  type: string;
  workspace: string;
  workspaceType: string;
  status: string;
  dueDate: string;
  messages: number;
  priority: string;
  assignedBy: string;
}

/**
 * Defines the structure for the workspace statistics object.
 * This provides type safety for the stats data displayed on the dashboard.
 */
export interface WorkspaceStats {
  teams: { count: number; change: string; trend: string };
  departments: { count: number; change: string; trend: string };
  activeTickets: { count: number; change: string; trend: string };
  completedThisWeek: { count: number; change: string; trend: string };
}
