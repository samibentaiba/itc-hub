// /admin/types.d.ts

import { z } from 'zod';

// --- Base Data Models ---

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
  id:string;
  name: string;
  description: string;
  members: Member[];
  departmentId: string;
  createdDate: string;
  status: "active" | "planning";
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
// These schemas define the validation rules for your forms.

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


// --- Form Data and UI State Types ---

export type UserFormData = z.infer<typeof userFormSchema>;
export type TeamFormData = z.infer<typeof teamFormSchema>;
export type DepartmentFormData = z.infer<typeof departmentFormSchema>;

// A single, unified type to manage which modal is open and what data it holds.
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
  | { view: 'MANAGE_MEMBERS', data: (Team & { entityType: 'team' }) | (Department & { entityType: 'department' }) }
  | null;

// A specific type for the loading state to prevent multiple spinners.
export type LoadingAction = string | null;
