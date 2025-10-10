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
  status: string; // verified, pending, etc.
  joinedDate: string;
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

// Profile-specific types for the profile page
export interface UserProfileLocal {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'manager' | 'user';
  title: string;
  department: string;
  location: string;
  phone: string;
  bio: string;
  socialLinks: {
    github: string;
    linkedin: string;
    twitter: string;
    website: string;
  };
}

export interface ProfileDataLocal {
  profile: UserProfileLocal;
  stats: UserStatsLocal;
  skills: UserSkillLocal[];
  projects: UserProjectLocal[];
  achievements: UserAchievementLocal[];
  teams: UserTeamLocal[];
  departments: UserDepartmentLocal[];
}

// User-related types for the users page
export interface UserLocal {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  department: string;
  status: "Active" | "Away" | "Offline";
  lastActive: string;
  projects: number;
}

export interface UserStatLocal {
  title: string;
  value: string;
  description: string;
  trend: string;
}

// User skill, project, achievement types for user detail page
export interface UserSkillLocal {
  name: string;
  level: number;
}

export interface UserProjectLocal {
  id: string;
  name: string;
  role: string;
  team: string;
  priority: string;
  progress: number;
}

export interface UserAchievementLocal {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
}

export interface UserTeamLocal {
  id: string;
  name: string;
  role: string;
  members: number;
  isLead: boolean;
}

export interface UserDepartmentLocal {
  id: string;
  name: string;
  role: string;
}

export interface UserStatsLocal {
  projectsCompleted: number;
  teamsLed: number;
  mentorshipHours: number;
  contributions: number;
}

export interface UserSocialLinksLocal {
  github: string;
  linkedin: string;
  twitter: string;
}

export interface UserDetailLocal {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  status: string;
  joinDate: string;
  title: string;
  department: string;
  location: string;
  bio: string;
  socialLinks: UserSocialLinksLocal;
  stats: UserStatsLocal;
  skills: UserSkillLocal[];
  currentProjects: UserProjectLocal[];
  achievements: UserAchievementLocal[];
  teams: UserTeamLocal[];
  departments: UserDepartmentLocal[];
}

// Ticket Types
export type TicketStatus = "open" | "in_progress" | "closed" | "new" | "resolved";
export type TicketPriority = "low" | "medium" | "high" | "urgent";

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
  type: string;
  dueDate: string;
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

// ADDED: Missing ticket-related types for local components
export interface ReactionLocal {
  emoji: string;
  users: string[];
  count: number;
}

export interface SenderLocal {
  id: string;
  name: string;
  avatar: string;
  role: string;
}

export interface MessageLocal {
  id: string;
  user: SenderLocal;
  comment: string;
  type: "text" | "image" | "file" | "system";
  timestamp: string;
  reactions: ReactionLocal[];
  edited: boolean;
}

export interface TicketDetailLocal extends Ticket {
  messages: MessageLocal[];
}

// Department & Team Types
export type Member = {
  userId: string;
  role: 'leader' | 'member';
};

export interface Department {
  id: string;
  name: string;
  manager?: Partial<User>;
  memberCount?: number;
  ticketCount?: number;
  teams?: Partial<Team>[];
  members: Member[];
  description: string;
  createdDate: string;
  status: string;
}

export interface Team {
  id: string;
  name: string;
  leader?: Partial<User>;
  department?: string;
  departmentId: string;
  memberCount?: number;
  members: Member[];
  description: string;
  createdDate: string;
  status: string;
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
  date: string;
  time: string;
  duration: number;
  attendees: string[];
  color: string;
  submittedBy?: string;
  submittedByType?: 'team' | 'department';
}

// MISSING TYPES - Adding these to fix the TypeScript errors
export interface CalendarLocalEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: number;
  type: string;
  attendees: string[];
  location: string;
  color: string;
}

export interface CalendarUpcomingEvent {
  id: string;
  title: string;
  date: string;
  type: string;
  attendees: number;
}

export type FormEventType = "meeting" | "review" | "workshop" | "planning";



export interface EventFormData {
  title: string;
  description: string;
  date: string;
  time: string;
  duration: string;
  type: FormEventType;
  location: string;
  isRecurring?: boolean;
}

// Global Calendar Types
export interface GlobalEventLocal {
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

export interface GlobalEventFormDataLocal {
  title: string;
  description: string;
  date: string;
  time: string;
  duration: string;
  type: string;
  location: string;
  isRecurring?: boolean;
}

export type GlobalLoadingActionLocal = "add-event" | "refresh" | "export" | null;

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

// Dashboard - Missing types
export interface DashboardTicketLocal {
  id: string;
  title: string;
  type: string;
  workspace: string;
  workspaceType: string;
  status: string;
  dueDate: string;
  messages: number;
  priority: string;
  assignedBy: string;
}

export interface WorkspaceStats {
  totalTickets: {
    count: number;
    change: string;
    trend: "up" | "down" | "stable";
  };
  teams: {
    count: number;
    change: string;
    trend: "up" | "down" | "stable";
  };
  departments: {
    count: number;
    change: string;
    trend: "up" | "down" | "stable";
  };
  activeTickets: {
    count: number;
    change: string;
    trend: "up" | "down" | "stable";
  };
  completedThisWeek: {
    count: number;
    change: string;
    trend: "up" | "down" | "stable";
  };
}

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

// Departments Page - Missing types
export interface DepartmentLocal {
  id: string;
  name: string;
  description: string;
  head: {
    name: string;
    avatar: string;
    id: string;
  };
  managers: {
    id: string;
    name: string;
    avatar: string;
  }[];
  teamCount: number;
  memberCount: number;
  status: "active" | "inactive";
  recentActivity: string;
  color: string;
  teams: Array<{
    name: string;
    memberCount: number;
  }>;
}

export interface DepartmentStatLocal {
  title: string;
  value: string;
  description: string;
  icon: string;
  trend: string;
}

// Departments Page
export type DepartmentsPageData = Partial<Department>[];

// Department Detail Page
export interface DepartmentDetailData extends Department {
    teams: Partial<Team>[];
    members: Member[];
    tickets: Partial<Ticket>[];
    events: Partial<CalendarEvent>[];
}

// Teams Page
export type TeamsPageData = Partial<Team>[];

// Team Detail Page
export interface TeamDetailData extends Team {
    members: Member[];
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



export interface StatLocal {
  title: string;
  value: string;
  description: string;
  trend: string;
}

export interface TeamLocal {
  id: string;
  name: string;
  description: string | null;
  department: string;
  memberCount: number;
  activeProjects: number;
  lead: {
    id: string;
    name: string;
    avatar: string;
  };
  leaders: {
    id: string;
    name: string;
    avatar: string;
  }[];
  members: {
    id: string;
    name: string;
    avatar: string;
  }[];
  recentActivity: string;
  status: string;
}


// Tickets Page Local Types
export interface TicketLocal {
  id: string;
  title: string;
  description: string;
  status: "new" | "in-progress" | "resolved"; // ✅ matches your filters
  priority: "low" | "medium" | "high" | "urgent";
  type: "Task" | "Bug" | "Feature";
  from: string;
  assignee: {
    id: string;
    name: string;
    avatar: string;
  };
  dueDate: string;
  comments: number;
}

export interface TicketStatLocal {
  title: string;
  value: string;
  description: string;
  trend: string;
}
