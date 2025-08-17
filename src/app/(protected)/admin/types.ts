// Re-export central types with local names for backward compatibility
export type {
  Member,
  User,
  Team,
  Department,
  CalendarEvent as Event,
  CalendarEvent as UpcomingEvent,
  CalendarEvent as PendingEvent,
} from "../types";

export type UserFormData = z.infer<typeof userFormSchema>;
export type TeamFormData = z.infer<typeof teamFormSchema>;
export type DepartmentFormData = z.infer<typeof departmentFormSchema>;
export type EventFormData = z.infer<typeof eventFormSchema>;

export type ModalState = {
    view: | "ADD_USER" | "EDIT_USER" | "DELETE_USER" | "VERIFY_USER" | "ADD_TEAM" | "EDIT_TEAM" | "DELETE_TEAM" | "MANAGE_MEMBERS" | "ADD_DEPARTMENT" | "EDIT_DEPARTMENT" | "DELETE_DEPARTMENT";
    data?: { id: string; entityType?: "team" | "department" };
} | null;

export type LoadingAction = string | null;

// Re-export validation schemas
import { z } from 'zod';

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

export const eventFormSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  description: z.string().optional(),
  date: z.string().min(1, { message: "Please select a date." }),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: "Please enter a valid time (HH:MM)." }),
  duration: z.string(),
  type: z.enum(["meeting", "review", "planning", "workshop"]),
  location: z.string().optional(),
});
