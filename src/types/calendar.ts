import { z } from "zod";

export interface Event {
  id: any;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: number;
  type: any;
  attendees: string[];
  location: string;
  color: string;
}

export interface UpcomingEvent {
  id: any;
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
  type: any;
  location?: string;
}

export const requestEventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  duration: z.string().min(1, "Duration is required"),
  type: z.string().min(1, "Type is required"),
  location: z.string().optional(),
});
