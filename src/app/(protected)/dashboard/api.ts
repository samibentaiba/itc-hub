// /dashboard/api.ts - Updated to use your comprehensive API system

import { getDashboardData } from '../api';
import type { DashboardData } from '../types';

/**
 * Fetches comprehensive dashboard data using the existing API system
 * This replaces the previous separate fetchWorkspaceStats and fetchTickets functions
 */
export const fetchDashboardData = async (): Promise<DashboardData> => {
  console.log("Fetching dashboard data...");
  const data = await getDashboardData();
  console.log("Fetched dashboard data:", data);
  return data;
};

// Keep these for backward compatibility if needed elsewhere
export const fetchWorkspaceStats = async () => {
  const dashboardData = await fetchDashboardData();
  
  // Transform dashboard stats to match the expected WorkspaceStats interface
  return {
    teams: { 
      count: 2, // You can derive this from dashboardData or your mock data
      change: "+1 this month", 
      trend: "up" 
    },
    departments: { 
      count: 2, 
      change: "No change", 
      trend: "stable" 
    },
    activeTickets: { 
      count: dashboardData.stats.openTickets + dashboardData.stats.pendingIssues, 
      change: `+${dashboardData.stats.pendingIssues} this week`, 
      trend: "up" 
    },
    completedThisWeek: { 
      count: dashboardData.stats.closedTickets, 
      change: `+${dashboardData.stats.closedTickets} from last week`, 
      trend: "up" 
    }
  };
};

export const fetchTickets = async () => {
  const dashboardData = await fetchDashboardData();
  
  // Transform recent tickets to match the expected Ticket interface
  return dashboardData.recentTickets.map(ticket => ({
    id: ticket.id || '',
    title: ticket.title || '',
    type: 'task', // Default type since it's not in original data
    workspace: ticket.team?.name || ticket.department?.name || 'Unknown',
    workspaceType: ticket.team ? 'team' : 'department',
    status: ticket.status || 'open',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default to 1 week from now
    messages: Math.floor(Math.random() * 10) + 1, // Random for demo
    priority: ticket.priority || 'medium',
    assignedBy: ticket.assignee?.name || 'System'
  }));
};