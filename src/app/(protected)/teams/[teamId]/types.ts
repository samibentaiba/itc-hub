// src/app/(protected)/teams/[teamId]/types.ts

import { z } from 'zod';

export const eventFormSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  description: z.string().optional(),
  date: z.string().min(1, { message: "Please select a date." }),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: "Please enter a valid time (HH:MM)." }),
  duration: z.string(),
  type: z.enum(["meeting", "review", "planning", "workshop"]),
  location: z.string().optional(),
});

export const requestEventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  duration: z.string().min(1, "Duration is required"),
  type: z.enum(["meeting", "review", "planning", "workshop"]),
  location: z.string().optional(),
});

// Update Event interface to use the same type union
export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: number;
  type: "meeting" | "review" | "planning" | "workshop";
  attendees: string[];
  location: string;
  color: string;
}

export interface UpcomingEvent {
  id: number;
  title: string;
  date: string;
  type: string;
  attendees: number;
}

export interface EventFormData {
  title: string;
  description?: string;
  date: string;
  time: string;
  duration: string;
  type: "meeting" | "review" | "planning" | "workshop";
  location?: string;
}

// Team-specific types that match the API response
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "leader" | "member";
  status: "online" | "away" | "offline";
  joinedDate: string;
}

export interface TeamTicket {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  priority: string;
  assignee: string | null;
  createdBy: string;
  dueDate: string;
  messages: number;
  lastActivity: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeamDetail {
  id: string;
  name: string;
  description: string;
  status: string;
  department: {
    id: string;
    name: string;
    description: string;
  } | null;
  leader: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    role: "admin" | "manager" | "user";
  } | null;
  members: TeamMember[];
  tickets: TeamTicket[];
  events: Event[];
  upcomingEvents: UpcomingEvent[];
}

// ADD MISSING TYPES FOR TEAMS LIST PAGE
export interface StatLocal {
  title: string;
  value: string;
  description: string;
  trend: string;
}

export interface TeamLocal {
  id: string;
  name: string;
  description: string | null;
  department: string;
  memberCount: number;
  activeProjects: number;
  lead: {
    id: string;
    name: string;
    avatar: string;
  };
  leaders: {
    id: string;
    name: string;
    avatar: string;
  }[];
  members: {
    id: string;
    name: string;
    avatar: string;
  }[];
  recentActivity: string;
  status: string;
}