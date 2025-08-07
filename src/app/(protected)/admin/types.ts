// /admin/types.ts

import { z } from 'zod';

// --- Base Data Models (Admin) ---
export interface Member {
  userId: string;
  role: "leader" | "member";
}

export interface User {
  id: string;
  name: string;
  email: string;
  status: "verified" | "pending";
  joinedDate: string;
  avatar: string;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  members: Member[];
  departmentId: string;
  createdDate: string;
  status: "active" | "archived";
}

export interface Department {
  id: string;
  name: string;
  description: string;
  members: Member[];
  teams: string[]; // Array of team IDs
  createdDate: string;
  status: "active";
}

// --- Zod Validation Schemas ---
export const userFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
});

export const teamFormSchema = z.object({
  name: z.string().min(3, { message: "Team name must be at least 3 characters." }),
  description: z.string().optional(),
  departmentId: z.string().min(1, { message: "Please select a department." }),
});

export const departmentFormSchema = z.object({
  name: z.string().min(3, { message: "Department name must be at least 3 characters." }),
  description: z.string().optional(),
});

// Zod schema for the event form
export const eventFormSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  description: z.string().optional(),
  date: z.string().min(1, { message: "Please select a date." }),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: "Please enter a valid time (HH:MM)." }),
  duration: z.string(),
  type: z.enum(["meeting", "review", "planning", "workshop"]),
  location: z.string().optional(),
});


// --- Form Data and UI State Types ---
export type UserFormData = z.infer<typeof userFormSchema>;
export type TeamFormData = z.infer<typeof teamFormSchema>;
export type DepartmentFormData = z.infer<typeof departmentFormSchema>;
export type EventFormData = z.infer<typeof eventFormSchema>; // This now uses the schema

export type ModalState =
  | { view: 'ADD_USER' }
  | { view: 'EDIT_USER', data: User }
  | { view: 'DELETE_USER', data: User }
  | { view: 'VERIFY_USER', data: User }
  | { view: 'ADD_TEAM' }
  | { view: 'EDIT_TEAM', data: Team }
  | { view: 'DELETE_TEAM', data: Team }
  | { view: 'ADD_DEPARTMENT' }
  | { view: 'EDIT_DEPARTMENT', data: Department }
  | { view: 'DELETE_DEPARTMENT', data: Department }
  | { view: 'MANAGE_MEMBERS', data: { id: string, name: string, entityType: 'team' | 'department' } }
  // Modal states for calendar events
  | { view: 'ADD_EVENT' }
  | { view: 'EDIT_EVENT', data: Event }
  | { view: 'DELETE_EVENT', data: Event }
  | { view: 'VIEW_EVENT', data: Event } // For viewing details
  | null;

export type LoadingAction = string | null;

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

// --- NEW: For Event Requests ---
export interface PendingEvent extends Event {
  submittedBy: string; // e.g., "Frontend Team" or "Engineering Department"
  submittedByType: 'team' | 'department';
}
