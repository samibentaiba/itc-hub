import { z } from "zod";

// Define the event type based on your Prisma EventType enum
export type EventType = "meeting" | "review" | "planning" | "workshop";

export interface Event {
  id: string | number;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: number;
  type: EventType;
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
  type: EventType;
  location?: string;
}

export const requestEventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  duration: z.string().min(1, "Duration is required"),
  type: z.enum(["meeting", "review", "planning", "workshop"] as const, { error: "Type is required" }),
  location: z.string().optional(),
});