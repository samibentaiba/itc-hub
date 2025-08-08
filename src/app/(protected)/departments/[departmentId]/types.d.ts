/**
 * types.d.ts
 *
 * This file contains all the shared type definitions for the application.
 * By centralizing types, we ensure consistency across different parts
 * of the codebase, from API responses to component props.
 */

// Defines the structure for a department member.
export type Member = {
  id: string;
  name: string;
  role: string;
  avatar: string;
};

// Defines the structure for a department, now including its associated teams, tickets, and members.
export type Department = {
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
  budget: string;
  status: string;
  createdAt: string;
  teams: Team[];
  tickets: Ticket[];
  members: Member[];
};

// Defines the structure for a leader within a department.
export type Leader = {
  id: string;
  name: string;
  role: "super_leader" | "leader";
  avatar: string;
  status: "online" | "offline";
  email: string;
  joinedDate: string;
};

// Defines the structure for a team within a department.
export type Team = {
  id: string;
  name: string;
  memberCount: number;
  leader: string;
  status: "active" | "planning" | "archived";
};

// Defines the structure for a ticket or initiative.
export type Ticket = {
  id: string;
  title: string;
  type: "meeting" | "task" | "event";
  status: "in_progress" | "pending" | "scheduled";
  assignee: string | null;
  duration: string;
  messages: number;
  lastActivity: string;
  collaborative: boolean;
  calendarDate: Date;
  collaborators: string[];
};
