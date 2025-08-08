/**
 * types.ts
 *
 * This file contains all the shared type definitions for the application.
 */
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

// --- Base Data Models (Department) ---
export type Member = {
  id: string;
  name: string;
  role: string;
  avatar: string;
};

export type Team = {
  id: string;
  name: string;
  memberCount: number;
  leader: string;
  status: "active" | "planning" | "archived";
};

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
  events: Event[];
  upcomingEvents: UpcomingEvent[];
};

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
