// src/app/(protected)/teams/[teamId]/types.d.ts
import { z } from 'zod';

// --- Base Data Models (Calendar) ---
export interface Event {
  id: number;
  title: string;
  description: string;
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:MM"
  duration: number; // in minutes
  type: "meeting" | "review" | "planning" | "workshop";
  attendees: string[];
  location: string;
  color: string;
}

export interface UpcomingEvent {
  id: number;
  title: string;
  date: string; // Formatted string like "Today, 9:00 AM"
  type: string;
  attendees: number;
}

// Defines the structure for a single team member on the detail page.
export interface TeamMember {
  id: string;
  name: string;
  role: "leader" | "member";
  avatar: string;
  status: "online" | "away" | "offline";
  email: string;
  joinedDate: string;
}

// Defines the structure for a single team, including its members.
export interface TeamDetail {
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
  status: "active" | "inactive";
  createdAt: string;
  members: TeamMember[];
  events: Event[];
  upcomingEvents: UpcomingEvent[];
}

// Defines the structure for a ticket associated with a team.
export interface TeamTicket {
  id: string;
  title: string;
  type: "task" | "meeting" | "event";
  status: "in_progress" | "scheduled" | "pending" | "verified";
  assignee: string | null;
  dueDate: string;
  messages: number;
  lastActivity: string;
}

// --- Zod Schemas for Forms ---
export const eventFormSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  description: z.string().optional(),
  date: z.string().min(1, { message: "Please select a date." }),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: "Please enter a valid time (HH:MM)." }),
  duration: z.string(),
  type: z.enum(["meeting", "review", "planning", "workshop"]),
  location: z.string().optional(),
});

export type EventFormData = z.infer<typeof eventFormSchema>;
