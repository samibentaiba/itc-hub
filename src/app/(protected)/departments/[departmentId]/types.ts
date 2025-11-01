import { z } from "zod";

// Note: These types are placeholders and may not be complete.

export interface User {
  id: string;
  name: string;
  avatar: string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  teams: Team[];
  members: Member[];
  tickets: Ticket[];
  events: Event[];
  managers: User[];
  status: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Event {
  id: string | number;
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
  id: string | number;
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

export interface Ticket {
  id: string;
  title: string;
  priority: string;
  status: string;
  assignee: User;
  reporter: User;
  createdAt: string;
  dueDate: string;
  updatedAt: string;
  description: string;
}

export interface Team {
  id: string;
  name: string;
  memberCount: number;
  leaders: User[];
  description: string;
}

export interface Member {
  id: string;
  name: string;
  avatar: string;
  role: string;
}

// ✅ FIXED: Match the schema to EventFormData interface exactly
export const requestEventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  duration: z.string().min(1, "Duration is required"),
  type: z.enum(["meeting", "review", "planning", "workshop"]),
  location: z.string().optional(),
});