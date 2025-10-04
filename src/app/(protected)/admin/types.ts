// src/app/(protected)/admin/types.ts
import { z } from "zod";
import type {
  User as PrismaUser,
  Team as PrismaTeam,
  Department as PrismaDepartment,
  Event as PrismaEvent,
  TeamMember,
  DepartmentMember,
} from "@prisma/client";

// ===== BASE ENTITIES =====

export interface Member {
  userId: string;
  role: "manager" | "member";
  user: {
    id: string;
    name: string;
    avatar?: string | null;
  };
}

export interface User
  extends Omit<PrismaUser, "password" | "emailVerified" | "createdAt" | "updatedAt"> {
  status: "verified" | "pending";
  joinedDate: string;
  avatar: string;
}

export interface Team
  extends Omit<PrismaTeam, "createdAt" | "updatedAt" | "departmentId"> {
  members: Member[];
  departmentId: string;
  status: "active" | "archived";
  createdDate: string;
  leaders: User[];
}

export interface Department
  extends Omit<PrismaDepartment, "createdAt" | "updatedAt"> {
  members: Member[];
  teams: Pick<Team, "id" | "name">[];
  status: "active" | "archived";
  createdDate: string;
  managers: User[];
}

export interface Event
  extends Omit<PrismaEvent, "createdAt" | "updatedAt" | "date"> {
  date: string; // YYYY-MM-DD
  attendees: {
    id: string;
    name: string;
    avatar?: string | null;
  }[];
  color: string;
}

// ===== UI-SPECIFIC & FORM TYPES =====

export interface UpcomingEvent {
  id: string;
  title: string;
  date: string;
  type: string;
  attendees: number;
}

export interface PendingEvent extends Omit<Event, 'attendees' | 'color'> {
  submittedBy: string;
  submittedByType: 'team' | 'department';
}

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
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: "Please enter a valid time (HH:MM)." }).optional(),
  
  duration: z.string(),
  type: z.enum(["meeting", "review", "planning", "workshop"]),
  location: z.string().optional(),
});

export type UserFormData = z.infer<typeof userFormSchema>;
export type TeamFormData = z.infer<typeof teamFormSchema>;
export type DepartmentFormData = z.infer<typeof departmentFormSchema>;
export type EventFormData = z.infer<typeof eventFormSchema>;

export type ModalState =
  | {
      view:
        | "ADD_USER"
        | "EDIT_USER"
        | "DELETE_USER"
        | "VERIFY_USER"
        | "ADD_TEAM"
        | "EDIT_TEAM"
        | "DELETE_TEAM"
        | "MANAGE_MEMBERS"
        | "ADD_DEPARTMENT"
        | "EDIT_DEPARTMENT"
        | "DELETE_DEPARTMENT";
      data?: { id: string; entityType?: "team" | "department" };
    }
  | null;

export type LoadingAction = string | null;