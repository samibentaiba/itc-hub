// src/app/(protected)/departments/[departmentId]/types.ts

// Base types matching the API structure
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "admin" | "manager" | "user";
}

export interface Ticket {
  id: string;
  title: string;
  description?: string;
  status: "open" | "in_progress" | "closed";
  priority: "low" | "medium" | "high";
  assignee: User | null;
  reporter: User | null;
  department?: Partial<Department>;
  team?: Partial<Team>;
  createdAt: string;
  updatedAt: string;
  dueDate?: string; // Optional due date
}

export interface Team {
  id: string;
  name: string;
  leader: User | null;
  memberCount: number;
  members: User[];
  description?: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "admin" | "manager" | "user";
}

export interface Department {
  id: string;
  name: string;
  manager: User | null;
  memberCount: number;
  ticketCount: number;
  teams: Team[];
  members: Member[];
  tickets: Ticket[];
  description: string;
  events: Event[];
}

// Calendar and Event types
export interface Event {
  id: number | string;
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
  id: number | string;
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

// Create a simple validation schema replacement
import { z } from 'zod';

export const requestEventSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  description: z.string().optional(),
  date: z.string().min(1, { message: "Please select a date." }),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: "Please enter a valid time (HH:MM)." }),
  duration: z.string(),
  type: z.enum(["meeting", "review", "planning", "workshop"]),
  location: z.string().optional(),
});