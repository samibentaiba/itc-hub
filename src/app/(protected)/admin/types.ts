// src/app/(protected)/admin/types.ts
import { z } from "zod";
import type {
  User as PrismaUser,
  Team as PrismaTeam,
  Department as PrismaDepartment,
  Event as PrismaEvent,
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

// Transform Prisma role to lowercase for UI
type UIRole = "user" | "manager" | "admin";

export interface User
  extends Omit<
    PrismaUser,
    "password" | "emailVerified" | "createdAt" | "updatedAt" | "role"
  > {
  role: UIRole;
  status: "verified" | "pending";
  joinedDate: string;
  avatar: string;
  [key: string]: unknown; // Allow any other string keys
}

export interface Team
  extends Omit<PrismaTeam, "createdAt" | "updatedAt" | "departmentId"> {
  members: Member[];
  departmentId: string;
  status: "active" | "archived";
  createdDate: string;
  leaders: User[];
  [key: string]: unknown; // Allow any other string keys
}

export interface Department
  extends Omit<PrismaDepartment, "createdAt" | "updatedAt" | "color"> {
  members: Member[];
  teams: Pick<Team, "id" | "name">[];
  status: "active" | "archived";
  createdDate: string;
  managers: User[];
  color?: string;
  [key: string]: unknown; // Allow any other string keys
}

export interface EventAttendee {
  id: string;
  name: string;
  avatar?: string | null;
}

export interface Event
  extends Omit<
    PrismaEvent,
    "createdAt" | "updatedAt" | "date" | "attendees" | "status" | "departmentId" | "organizerId" | "isRecurring" | "teamId"
  > {
  date: string; // YYYY-MM-DD
  attendees: EventAttendee[] | string[];
  color: string;
  status?: string;
  departmentId?: string | null;
  organizerId?: string | null;
  isRecurring?: boolean;
  teamId?: string | null;
  [key: string]: unknown; // Allow any other string keys
}

// ===== UI-SPECIFIC & FORM TYPES =====

export interface UpcomingEvent {
  id: string;
  title: string;
  date: string;
  type: string;
  attendees: number;
}

export interface PendingEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  duration: number;
  type: "meeting" | "review" | "planning" | "workshop";
  location: string;
  submittedBy: string;
  submittedByType: "team" | "department" | "user";
  [key: string]: unknown; // Allow any other string keys
}

// ===== FORM SCHEMAS =====

export const userFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z
    .string()
    .email({ message: "Please enter a valid email." })
    .toLowerCase(),
});

export const teamFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Team name must be at least 3 characters." }),
  description: z.string().optional(),
  departmentId: z.string().min(1, { message: "Please select a department." }),
});

export const departmentFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Department name must be at least 3 characters." }),
  description: z.string().optional(),
});

export const eventFormSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters." }),
  description: z.string().optional(),
  date: z.string().min(1, { message: "Please select a date." }),
  time: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
      message: "Please enter a valid time (HH:MM).",
    })
    .optional()
    .or(z.literal("")),
  duration: z.string(),
  type: z.enum(["meeting", "review", "planning", "workshop"]),
  location: z.string().optional(),
});

export type UserFormData = z.infer<typeof userFormSchema>;
export type TeamFormData = z.infer<typeof teamFormSchema>;
export type DepartmentFormData = z.infer<typeof departmentFormSchema>;
export type EventFormData = z.infer<typeof eventFormSchema>;

// ===== MODAL STATE MANAGEMENT =====

// ModalData with index signature to accept any entity type
export interface ModalData extends Record<string, unknown> {
  id?: string;
  entityType?: "team" | "department";
}

// Union type for all possible modal data payloads
export type ModalDataPayload =
  | (User & { id: string; })
  | (Team & { id: string; entityType: "team"; })
  | (Department & { id: string; entityType: "department"; })
  | ({ id: string; } & Record<string, unknown>);

export type ModalViewType =
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

export interface ModalState {
  view: ModalViewType;
  data?: ModalDataPayload;
}

export type LoadingAction = string | null;

export type ManagingEntity =
  | ({ entityType: "team" } & Team)
  | ({ entityType: "department" } & Department)
  | null;

// ===== UTILITY TYPES =====

export type EventType = "meeting" | "review" | "planning" | "workshop";
export type UserStatus = "verified" | "pending";
export type EntityStatus = "active" | "archived";
export type MembershipRole = "manager" | "member";