// Re-export central types with local names for backward compatibility
export type {
  MemberAdmin as Member,
  UserAdmin as User,
  TeamAdmin as Team,
  DepartmentAdmin as Department,
  EventAdmin as Event,
  UpcomingEventAdmin as UpcomingEvent,
  PendingEventAdmin as PendingEvent,
  UserFormDataAdmin as UserFormData,
  TeamFormDataAdmin as TeamFormData,
  DepartmentFormDataAdmin as DepartmentFormData,
  EventFormDataAdmin as EventFormData,
  ModalStateAdmin as ModalState,
  LoadingActionAdmin as LoadingAction
} from "../types";

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
