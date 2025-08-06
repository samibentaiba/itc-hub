// /calendar/types.d.ts

/**
 * Defines the structure for a single calendar event object.
 * This is the primary data model for events shown on the calendar grid.
 */
export interface Event {
  id: number;
  title: string;
  description: string;
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:MM"
  duration: number; // in minutes
  type: string;
  attendees: string[];
  location: string;
  color: string;
}

/**
 * Defines the structure for an event in the "Upcoming Events" list.
 * This can be a simplified version of the main Event type.
 */
export interface UpcomingEvent {
  id: number;
  title: string;
  date: string; // Formatted string like "Today, 9:00 AM"
  type: string;
  attendees: number;
}

/**
 * Defines the structure for the data collected from the "Create Event" form.
 */
export interface EventFormData {
  title: string;
  description: string;
  date: string;
  time: string;
  duration: string;
  type: string;
  location: string;
}
