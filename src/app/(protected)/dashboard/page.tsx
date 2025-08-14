// /dashboard/page.tsx - Updated to use clean API

import { getDashboardData } from "../api";
import DashboardClientPage from "./client";

/**
 * Server Component that fetches dashboard data using the clean API
 */
export default async function DashboardPage() {
  try {
    // Fetch dashboard data using the clean API
    const dashboardData = await getDashboardData();

    // Transform the data to match what the client component expects
    const stats = {
      teams: { 
        count: 5, // You can derive this from your data or fetch separately
        change: "+1 this month", 
        trend: "up" as const
      },
      departments: { 
        count: 3, 
        change: "No change", 
        trend: "stable" as const
      },
      activeTickets: { 
        count: dashboardData.stats.openTickets + dashboardData.stats.pendingIssues, 
        change: `+${dashboardData.stats.pendingIssues} pending`, 
        trend: dashboardData.stats.pendingIssues > 0 ? "up" as const : "stable" as const
      },
      completedThisWeek: { 
        count: dashboardData.stats.closedTickets, 
        change: `${dashboardData.stats.closedTickets} completed`, 
        trend: "up" as const
      }
    };

    // Transform tickets to match expected format
    const tickets = dashboardData.recentTickets.map(ticket => ({
      id: ticket.id || '',
      title: ticket.title || '',
      type: 'task',
      workspace: ticket.team?.name || ticket.department?.name || 'Unknown',
      workspaceType: ticket.team ? 'team' : 'department',
      status: ticket.status || 'open',
      dueDate: ticket.updatedAt ? new Date(new Date(ticket.updatedAt).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      messages: Math.floor(Math.random() * 10) + 1, // Demo data
      priority: ticket.priority || 'medium',
      assignedBy: ticket.reporter?.name || ticket.assignee?.name || 'System'
    }));

    return (
      <DashboardClientPage
        initialStats={stats}
        initialTickets={tickets}
        dashboardData={dashboardData}
      />
    );
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
    
    // Fallback to empty data if fetch fails
    return (
      <DashboardClientPage
        initialStats={{
          teams: { count: 0, change: "Unable to load", trend: "stable" },
          departments: { count: 0, change: "Unable to load", trend: "stable" },
          activeTickets: { count: 0, change: "Unable to load", trend: "stable" },
          completedThisWeek: { count: 0, change: "Unable to load", trend: "stable" }
        }}
        initialTickets={[]}
        dashboardData={null}
      />
    );
  }
}