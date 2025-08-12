// Re-export central types with local names for backward compatibility
export type {
  EventDetailLocal as Event,
  CalendarUpcomingEvent as UpcomingEvent,
  EventFormDataLocal as EventFormData,
  DepartmentDetailLocal as Department,
  MemberLocal as Member,
  TeamDetailLocal as Team,
  DeptTicketLocal as Ticket
} from "../../types";

// Re-export the form data type
export type { EventFormDataLocal } from "../../types";

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