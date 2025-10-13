// /calendar/global/types.ts

import { Event } from "@prisma/client";

// Re-export central types with local names for backward compatibility
export type {
  GlobalEventLocal as GlobalEvent,
  GlobalEventFormDataLocal as EventFormData,
  GlobalLoadingActionLocal as LoadingAction
} from "../../types";

// Workspace interface for the add event form
export interface Workspace {
  id: string;
  name: string;
  type: "department" | "team";
}

// Upcoming event interface for sidebar
export interface UpcomingEvent {
  id: string;
  title: string;
  date: string;
  type: string;
}

// Extended Event type with color property
export interface EventWithColor extends Event {
  color: string | null;
}

// Props interfaces
export interface GlobalCalendarClientPageProps {
  initialEvents: Event[];
  initialUpcomingEvents: UpcomingEvent[];
  availableWorkspaces: Workspace[];
}

export interface GlobalCalendarSidebarProps {
  upcomingEvents: UpcomingEvent[];
  allEvents: Event[];
  onEventClick: (event: Event | null) => void;
}

export interface EventDetailsDialogProps {
  event: Event | null;
  onClose: () => void;
}

export interface CalendarGridProps {
  currentDate: Date;
  events: Event[];
  onSelectEvent: (event: Event) => void;
  view: CalendarViewType;
  handleDayClick: (date: Date) => void;
}

// Calendar view types
export type CalendarViewType = "month" | "week" | "day";

// Hook return type
export interface UseGlobalCalendarReturn {
  currentDate: Date;
  view: CalendarViewType;
  events: Event[];
  upcomingEvents: UpcomingEvent[];
  setView: (view: CalendarViewType) => void;
  onNavigate: (direction: "prev" | "next") => void;
  handleDayClick: (date: Date) => void;
  formatDate: (date: Date, view: CalendarViewType) => string;
  getDaysInMonth: (date: Date) => number;
  getFirstDayOfMonth: (date: Date) => number;
  formatDateString: (date: Date) => string;
}

// Department and Team response types for API
export interface DepartmentResponse {
  id: string;
  name: string;
}

export interface TeamResponse {
  id: string;
  name: string;
}

export interface EventsApiResponse {
  events: Event[];
}

export interface DepartmentsApiResponse {
  departments: DepartmentResponse[];
}

export interface TeamsApiResponse {
  teams: TeamResponse[];
}