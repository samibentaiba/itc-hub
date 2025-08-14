// src/app/(protected)/types.ts

// General User and Profile Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "admin" | "user" | "manager";
  team?: string;
  department?: string;
}

export interface Profile extends User {
  bio: string;
  skills: string[];
  socialLinks: {
    linkedin: string;
    twitter: string;
    github: string;
  };
}

// Ticket Types
export type TicketStatus = "open" | "in_progress" | "closed";
export type TicketPriority = "low" | "medium" | "high";

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  assignee: Partial<User>;
  reporter: Partial<User>;
  department: Partial<Department>;
  team?: Partial<Team>;
  createdAt: string;
  updatedAt: string;
}

export interface TicketComment {
    id: string;
    user: Partial<User>;
    comment: string;
    createdAt: string;
}

export interface TicketDetails extends Ticket {
    comments: TicketComment[];
    attachments: File[];
}

// Department & Team Types
export interface Department {
  id: string;
  name: string;
  manager: Partial<User>;
  memberCount: number;
  ticketCount: number;
  teams: Partial<Team>[];
  members: Partial<User>[];
  description: string;
}

export interface Team {
  id: string;
  name: string;
  leader: Partial<User>;
  department: string;
  memberCount: number;
  members: Partial<User>[];
  description: string;
}

// --- Calendar & Event Types ---
export type EventType = "meeting" | "deadline" | "personal" | "team-event" | "department-event" | "global";

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  allDay: boolean;
  type: EventType;
  description: string;
  participants?: Partial<User>[];
  location?: string;
}

// Represents the aggregated data for a user's personal calendar view
export interface PersonalCalendarData {
    personalEvents: CalendarEvent[];
    teamEvents: CalendarEvent[];
    departmentEvents: CalendarEvent[];
}

// Represents the data for the global, company-wide calendar
export interface GlobalCalendarData {
    events: CalendarEvent[];
}

// --- Page-specific Data Types ---

// Dashboard
export interface DashboardStats {
  openTickets: number;
  closedTickets: number;
  newUsers: number;
  pendingIssues: number;
}

export interface RecentActivity {
  id: string;
  user: Partial<User>;
  action: string;
  target: string;
  createdAt: string;
}

export interface DashboardData {
  stats: DashboardStats;
  recentTickets: Partial<Ticket>[];
  upcomingEvents: Partial<CalendarEvent>[];
  recentActivity: Partial<RecentActivity>[];
}

// Departments Page
export type DepartmentsPageData = Partial<Department>[];

// Department Detail Page
export interface DepartmentDetailData extends Department {
    teams: Partial<Team>[];
    members: Partial<User>[];
    tickets: Partial<Ticket>[];
    events: Partial<CalendarEvent>[];
}

// Teams Page
export type TeamsPageData = Partial<Team>[];

// Team Detail Page
export interface TeamDetailData extends Team {
    members: Partial<User>[];
    tickets: Partial<Ticket>[];
    events: Partial<CalendarEvent>[];
}

// Tickets Page
export interface TicketsPageData {
    tickets: Partial<Ticket>[];
    stats: {
        open: number;
        inProgress: number;
        closed: number;
    }
}

// Users Page
export type UsersPageData = Partial<User>[];

// User Detail Page
export interface UserDetailData extends User {
    profile: Profile;
    assignedTickets: Partial<Ticket>[];
    reportedTickets: Partial<Ticket>[];
    activity: Partial<RecentActivity>[];
}

// Settings Page
export interface SettingsData {
    profile: Partial<Profile>;
    notifications: {
        email: boolean;
        push: boolean;
        ticketUpdates: boolean;
        mentions: boolean;
    };
    theme: "light" | "dark" | "system";
}

// File Type
export interface File {
  id: string;
  name: string;
  url: string;
  size: number; // in bytes
  type: string; // e.g., 'application/pdf', 'image/jpeg'
  uploadedAt: string;
  uploadedBy: Partial<User>;
}

// Root type for the entire mock data structure.
export interface MockData {
  dashboard: DashboardData;
  personalCalendar: PersonalCalendarData;
  globalCalendar: GlobalCalendarData;
  departments: DepartmentsPageData;
  departmentDetail: DepartmentDetailData;
  profile: Profile;
  settings: SettingsData;
  teams: TeamsPageData;
  teamDetail: TeamDetailData;
  tickets: TicketsPageData;
  ticketDetail: TicketDetails;
  users: UsersPageData;
  userDetail: UserDetailData;
}
