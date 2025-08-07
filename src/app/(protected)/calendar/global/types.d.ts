// --- /calendar/global/types.d.ts ---
export interface GlobalEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  duration: string;
  type: string;
  location: string;
  organizer: string;
  attendees: number;
  isRecurring: boolean;
}

export interface EventFormData {
  title: string;
  description: string;
  date: string;
  time: string;
  type: string;
  location: string;
  isRecurring: boolean;
}

export type LoadingAction = "add-event" | "export" | "refresh" | null;

