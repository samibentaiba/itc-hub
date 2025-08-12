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

// === LOCAL TYPES FROM INDIVIDUAL DIRECTORIES ===

// Dashboard Local Types
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
  teams: { count: number; change: string; trend: string };
  departments: { count: number; change: string; trend: string };
  activeTickets: { count: number; change: string; trend: string };
  completedThisWeek: { count: number; change: string; trend: string };
}

// Calendar Local Types
export interface CalendarLocalEvent {
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

export interface CalendarUpcomingEvent {
  id: number;
  title: string;
  date: string; // Formatted string like "Today, 9:00 AM"
  type: string;
  attendees: number;
}

export interface EventFormData {
  title: string;
  description: string;
  date: string;
  time: string;
  duration: string;
  type: string;
  location: string;
}

// Departments Local Types
export interface DepartmentStatLocal {
  title: string;
  value: string;
  description: string;
  trend: string;
}

export interface TeamLocalForDept {
  name: string;
  memberCount: number;
}

export interface DepartmentLocal {
  id: string;
  name: string;
  description: string;
  head: {
    name: string;
    avatar: string;
    id: string;
  };
  teamCount: number;
  memberCount: number;
  status: "active" | "inactive";
  recentActivity: string;
  color: string;
  teams: TeamLocalForDept[];
}

// Teams Local Types
export interface TeamLocal {
  id: string;
  name: string;
  description: string;
  department: string;
  memberCount: number;
  activeProjects: number;
  lead: {
    name: string;
    avatar: string;
    id: string;
  };
  members: {
    name: string;
    avatar: string;
    id: string;
  }[];
  recentActivity: string;
  status: "active" | "inactive";
}

export interface TeamStatLocal {
  title: string;
  value: string;
  description: string;
  trend: string;
}

// Tickets Local Types
export interface TicketLocal {
  id: string;
  title: string;
  description: string;
  status: "new" | "in-progress" | "resolved";
  priority: "low" | "medium" | "high" | "urgent";
  type: "Task" | "Bug" | "Feature";
  from: string;
  assignee: {
    name: string;
    avatar: string;
    id: string;
  };
  reporter: {
    name: string;
    avatar: string;
    id: string;
  };
  createdAt: string;
  updatedAt: string;
  dueDate: string;
  comments: number;
}

export interface TicketStatLocal {
  title: string;
  value: string;
  description: string;
  trend: string;
}

// Users Local Types
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

// Profile Local Types
export interface UserProfileLocal {
  name: string;
  email: string;
  phone: string;
  title: string;
  department: string;
  location: string;
  bio: string;
  avatar: string;
  socialLinks: SocialLinksLocal;
}

export interface SocialLinksLocal {
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
}

export interface ProfileStatsLocal {
  projectsCompleted: number;
  teamsLed: number;
  mentorshipHours: number;
  contributions: number;
}

export interface SkillLocal {
  name: string;
  level: number;
}

export interface ProjectLocal {
  id: number;
  name: string;
  role: string;
  progress: number;
  priority: "High" | "Medium" | "Low";
  team: string;
}

export interface AchievementLocal {
  id: number;
  title: string;
  description: string;
  date: string;
  category: "Innovation" | "Leadership" | "Technical" | "Design";
}

export interface TeamMembershipLocal {
  id: number;
  name: string;
  role: string;
  members: number;
  isLead: boolean;
}

export interface ProfileDataLocal {
  profile: UserProfileLocal;
  stats: ProfileStatsLocal;
  skills: SkillLocal[];
  projects: ProjectLocal[];
  achievements: AchievementLocal[];
  teams: TeamMembershipLocal[];
  departments: TeamMembershipLocal[];
}

// Settings Local Types
export interface UserSettingsLocal {
  displayName: string;
  email: string;
  notifications: boolean;
}

// Department Detail Local Types
export interface MemberLocal {
  id: string;
  name: string;
  role: 'leader' | 'member';
  avatar: string;
}

export interface TeamDetailLocal {
  id: string;
  name: string;
  memberCount: number;
  leader: string;
  status: "active" | "planning" | "archived";
}

export interface DeptTicketLocal {
  id: string;
  title: string;
  type: "meeting" | "task" | "event";
  status: "in_progress" | "pending" | "scheduled";
  assignee: string | null;
  duration: string;
  messages: number;
  lastActivity: string;
  collaborative: boolean;
  calendarDate: Date;
  collaborators: string[];
}

export interface EventDetailLocal {
  id: number;
  title: string;
  description: string;
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:MM"
  duration: number; // in minutes
  type: "meeting" | "review" | "planning" | "workshop";
  attendees: string[];
  location: string;
  color: string;
}

export interface DepartmentDetailLocal {
  id: string;
  name: string;
  description: string;
  head: {
    name: string;
    avatar: string;
    id: string;
  };
  teamCount: number;
  memberCount: number;
  budget: string;
  status: string;
  createdAt: string;
  teams: TeamDetailLocal[];
  tickets: DeptTicketLocal[];
  members: MemberLocal[];
  events: EventDetailLocal[];
}

// Form schemas and validation types
export interface EventFormDataLocal {
  title: string;
  description?: string;
  date: string;
  time: string;
  duration: string;
  type: "meeting" | "review" | "planning" | "workshop";
  location?: string;
}

// Team Detail Local Types
export interface TeamMemberLocal {
  id: string;
  name: string;
  role: "leader" | "member";
  avatar: string;
  status: "online" | "away" | "offline";
  email: string;
  joinedDate: string;
}

export interface TeamDetailLocalFull {
  id: string;
  name: string;
  description: string;
  department: string;
  memberCount: number;
  activeProjects: number;
  lead: {
    name: string;
    avatar: string;
    id: string;
  };
  status: "active" | "inactive";
  createdAt: string;
  members: TeamMemberLocal[];
  events: EventDetailLocal[];
  upcomingEvents: CalendarUpcomingEvent[];
}

export interface TeamTicketLocal {
  id: string;
  title: string;
  type: "task" | "meeting" | "event";
  status: "in_progress" | "scheduled" | "pending" | "verified";
  assignee: string | null;
  dueDate: string;
  messages: number;
  lastActivity: string;
}

// Ticket Detail Local Types
export interface ReactionLocal {
  emoji: string;
  users: string[];
  count: number;
}

export interface SenderLocal {
  id: string;
  name: string;
  avatar: string;
  role: "leader" | "member";
}

export interface MessageLocal {
  id: string;
  sender: SenderLocal;
  content: string;
  type: "text" | "image" | "file" | "system";
  timestamp: string;
  reactions: ReactionLocal[];
  edited: boolean;
  hasUrl?: boolean;
}

export interface TicketDetailLocal {
  id: string;
  title: string;
  description: string;
  status: "new" | "in-progress" | "resolved";
  priority: "low" | "medium" | "high" | "urgent";
  type: "Task" | "Bug" | "Feature";
  from: string;
  assignee: { name: string; avatar: string; id: string; };
  reporter: { name: string; avatar: string; id: string; };
  createdAt: string;
  updatedAt: string;
  dueDate: string;
  comments: number;
}

// User Detail Local Types
export interface UserSkillLocal {
  name: string;
  level: number;
}

export interface UserProjectLocal {
  id: number;
  name: string;
  role: string;
  progress: number;
  priority: string;
  team: string;
}

export interface UserAchievementLocal {
  id: number;
  title: string;
  description: string;
  date: string;
  category: string;
}

export interface UserTeamLocal {
  id: number;
  name: string;
  role: string;
  members: number;
  isLead: boolean;
}

export interface UserDepartmentLocal {
  id: number;
  name: string;
  role: string;
  isLead: boolean;
}

export interface UserStatsLocal {
  projectsCompleted: number;
  teamsLed: number;
  mentorshipHours: number;
  contributions: number;
}

export interface UserSocialLinksLocal {
  github?: string;
  linkedin: string;
  twitter?: string;
}

export interface UserDetailLocal {
  id: string;
  name: string;
  email: string;
  avatar: string;
  title: string;
  department: string;
  location: string;
  joinDate: string;
  bio: string;
  stats: UserStatsLocal;
  skills: UserSkillLocal[];
  socialLinks: UserSocialLinksLocal;
  currentProjects: UserProjectLocal[];
  achievements: UserAchievementLocal[];
  teams: UserTeamLocal[];
  departments: UserDepartmentLocal[];
}
