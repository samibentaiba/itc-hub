// src/app/(protected)/admin/properties.ts

import type {
  EventType,
  ProjectType,
  ContentStatus,
  MembershipRole,
} from "./types";

// ===== API ENDPOINTS CONFIGURATION =====

export const API_ENDPOINTS = {
  users: {
    list: "/api/admin/users",
    create: "/api/admin/users",
    update: (id: string) => `/api/admin/users/${id}`,
    delete: (id: string) => `/api/admin/users/${id}`,
    verify: (id: string) => `/api/admin/users/${id}/verify`,
  },
  teams: {
    list: "/api/admin/teams",
    create: "/api/admin/teams",
    update: (id: string) => `/api/admin/teams/${id}`,
    delete: (id: string) => `/api/admin/teams/${id}`,
    members: {
      add: (id: string) => `/api/admin/teams/${id}/members`,
      remove: (teamId: string, userId: string) =>
        `/api/admin/teams/${teamId}/members/${userId}`,
      updateRole: (teamId: string, userId: string) =>
        `/api/admin/teams/${teamId}/members/${userId}`,
    },
  },
  departments: {
    list: "/api/admin/departments",
    create: "/api/admin/departments",
    update: (id: string) => `/api/admin/departments/${id}`,
    delete: (id: string) => `/api/admin/departments/${id}`,
    members: {
      add: (id: string) => `/api/admin/departments/${id}/members`,
      remove: (deptId: string, userId: string) =>
        `/api/admin/departments/${deptId}/members/${userId}`,
      updateRole: (deptId: string, userId: string) =>
        `/api/admin/departments/${deptId}/members/${userId}`,
    },
  },
  events: {
    list: "/api/admin/events",
    create: "/api/admin/events",
    update: (id: string) => `/api/admin/events/${id}`,
    delete: (id: string) => `/api/admin/events/${id}`,
    requests: {
      list: "/api/admin/events/requests",
      approve: (id: string) => `/api/admin/events/requests/${id}/approve`,
      reject: (id: string) => `/api/admin/events/requests/${id}/reject`,
    },
  },
  projects: {
    list: "/api/admin/projects",
    create: "/api/admin/projects",
    update: (id: string) => `/api/admin/projects/${id}`,
    delete: (id: string) => `/api/admin/projects/${id}`,
    updateStatus: (id: string) => `/api/admin/projects/${id}/status`,
    requests: {
      list: "/api/admin/projects/requests",
      approve: (id: string) => `/api/admin/projects/${id}/approve`,
      reject: (id: string) => `/api/admin/projects/${id}/reject`,
    },
  },
  vlogs: {
    list: "/api/admin/vlogs",
    create: "/api/admin/vlogs",
    update: (id: string) => `/api/admin/vlogs/${id}`,
    delete: (id: string) => `/api/admin/vlogs/${id}`,
    updateStatus: (id: string) => `/api/admin/vlogs/${id}/status`,
    requests: {
      list: "/api/admin/vlogs/requests",
      approve: (id: string) => `/api/admin/vlogs/${id}/approve`,
      reject: (id: string) => `/api/admin/vlogs/${id}/reject`,
    },
  },
} as const;

// ===== TABLE COLUMN CONFIGURATIONS =====

export const TABLE_COLUMNS = {
  users: [
    { key: "user", label: "User", width: "auto" },
    { key: "status", label: "Status", width: "150px" },
    { key: "actions", label: "Actions", width: "100px", align: "right" as const },
  ],
  teams: [
    { key: "team", label: "Team", width: "auto" },
    { key: "leader", label: "Leader", width: "200px" },
    { key: "members", label: "Members", width: "100px" },
    { key: "actions", label: "Actions", width: "100px", align: "right" as const },
  ],
  departments: [
    { key: "department", label: "Department", width: "auto" },
    { key: "manager", label: "Manager", width: "200px" },
    { key: "members", label: "Members", width: "100px" },
    { key: "teams", label: "Teams", width: "100px" },
    { key: "actions", label: "Actions", width: "100px", align: "right" as const },
  ],
  events: [
    { key: "event", label: "Event Title", width: "auto" },
    { key: "submittedBy", label: "Submitted By", width: "200px" },
    { key: "dateTime", label: "Date & Time", width: "200px" },
    { key: "actions", label: "Actions", width: "150px", align: "right" as const },
  ],
  projects: [
    { key: "project", label: "Project", width: "auto" },
    { key: "type", label: "Type", width: "150px" },
    { key: "author", label: "Author", width: "200px" },
    { key: "status", label: "Status", width: "150px" },
    { key: "actions", label: "Actions", width: "100px", align: "right" as const },
  ],
  vlogs: [
    { key: "vlog", label: "Vlog", width: "auto" },
    { key: "author", label: "Author", width: "200px" },
    { key: "status", label: "Status", width: "150px" },
    { key: "date", label: "Date", width: "150px" },
    { key: "actions", label: "Actions", width: "100px", align: "right" as const },
  ],
  contentRequests: [
    { key: "type", label: "Type", width: "100px" },
    { key: "title", label: "Title", width: "auto" },
    { key: "submittedBy", label: "Submitted By", width: "200px" },
    { key: "date", label: "Date", width: "150px" },
    { key: "actions", label: "Actions", width: "150px", align: "right" as const },
  ],
} as const;

// ===== DROPDOWN MENU CONFIGURATIONS =====

export const DROPDOWN_MENUS = {
  user: [
    { id: "edit", label: "Edit User", icon: "Edit" },
    { id: "email", label: "Send Email", icon: "Mail" },
    { id: "separator", type: "separator" as const },
    { id: "delete", label: "Delete User", icon: "Trash2", destructive: true },
  ],
  team: [
    { id: "manage", label: "Manage Members", icon: "Users2" },
    { id: "edit", label: "Edit Team", icon: "Edit" },
    { id: "separator", type: "separator" as const },
    { id: "delete", label: "Delete Team", icon: "Trash2", destructive: true },
  ],
  department: [
    { id: "manage", label: "Manage Members", icon: "Users2" },
    { id: "edit", label: "Edit Department", icon: "Edit" },
    { id: "separator", type: "separator" as const },
    { id: "delete", label: "Delete Department", icon: "Trash2", destructive: true },
  ],
  project: [
    { id: "view", label: "View Project", icon: "Eye" },
    { id: "edit", label: "Edit Project", icon: "Edit" },
    { id: "separator", type: "separator" as const },
    { id: "delete", label: "Delete Project", icon: "Trash2", destructive: true },
  ],
  vlog: [
    { id: "view", label: "View Vlog", icon: "Eye" },
    { id: "edit", label: "Edit Vlog", icon: "Edit" },
    { id: "separator", type: "separator" as const },
    { id: "delete", label: "Delete Vlog", icon: "Trash2", destructive: true },
  ],
} as const;

// ===== SELECT OPTIONS CONFIGURATIONS =====

export const SELECT_OPTIONS = {
  eventTypes: [
    { value: "meeting", label: "Meeting" },
    { value: "review", label: "Review" },
    { value: "planning", label: "Planning" },
    { value: "workshop", label: "Workshop" },
  ] as const,
  eventDurations: [
    { value: "30", label: "30 min" },
    { value: "60", label: "1 hour" },
    { value: "90", label: "1.5 hours" },
    { value: "120", label: "2 hours" },
  ] as const,
  projectTypes: [
    { value: "AI", label: "AI" },
    { value: "UI_UX", label: "UI/UX" },
    { value: "SOFTWARE", label: "Software" },
    { value: "WEB_DEV", label: "Web Development" },
    { value: "NETWORKING", label: "Networking" },
    { value: "SECURITY", label: "Security" },
    { value: "DEV_OPS", label: "DevOps" },
    { value: "VFX", label: "VFX" },
    { value: "MEDIA", label: "Media" },
    { value: "SPONSORS", label: "Sponsors" },
    { value: "ROBOTICS", label: "Robotics" },
    { value: "GAME_DEV", label: "Game Development" },
  ] as const,
  contentStatuses: [
    { value: "published", label: "Published" },
    { value: "pending", label: "Pending" },
    { value: "draft", label: "Draft" },
  ] as const,
  memberRoles: {
    team: [
      { value: "manager", label: "Leader" },
      { value: "member", label: "Member" },
    ] as const,
    department: [
      { value: "manager", label: "Manager" },
      { value: "member", label: "Member" },
    ] as const,
  },
} as const;

// ===== BADGE VARIANT MAPPINGS =====

export const BADGE_VARIANTS = {
  userStatus: {
    verified: "default" as const,
    pending: "secondary" as const,
  },
  contentStatus: {
    published: "default" as const,
    pending: "secondary" as const,
    draft: "outline" as const,
  },
  entityType: {
    team: "secondary" as const,
    department: "outline" as const,
    user: "outline" as const,
  },
} as const;

// ===== CALENDAR CONFIGURATION =====

export const CALENDAR_CONFIG = {
  views: ["month", "week", "day"] as const,
  defaultView: "month" as const,
  weekDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const,
  weekDaysFull: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ] as const,
  eventColors: {
    meeting: "bg-blue-500",
    review: "bg-purple-500",
    planning: "bg-green-500",
    workshop: "bg-orange-500",
  } as const,
  timeSlots: Array.from({ length: 16 }, (_, i) => i + 8), // 8 AM to 11 PM
} as const;

// ===== TOAST MESSAGES =====

export const TOAST_MESSAGES = {
  success: {
    userAdded: "User Added",
    userUpdated: "User Updated",
    userDeleted: "User Deleted",
    userVerified: "User Verified",
    teamCreated: "Team Created",
    teamUpdated: "Team Updated",
    teamDeleted: "Team Deleted",
    departmentCreated: "Department Created",
    departmentUpdated: "Department Updated",
    departmentDeleted: "Department Deleted",
    memberAdded: "Member Added",
    memberRemoved: "Member Removed",
    memberRoleUpdated: "Member Role Updated",
    eventCreated: "Event Created",
    eventUpdated: "Event Updated",
    eventDeleted: "Event Deleted",
    eventApproved: "Event Approved",
    eventRejected: "Event Rejected",
    projectCreated: "Project Created",
    projectUpdated: "Project Updated",
    projectDeleted: "Project Deleted",
    projectApproved: "Project Approved",
    projectRejected: "Project Rejected",
    statusUpdated: "Status Updated",
    vlogCreated: "Vlog Created",
    vlogUpdated: "Vlog Updated",
    vlogDeleted: "Vlog Deleted",
    vlogApproved: "Vlog Approved",
    vlogRejected: "Vlog Rejected",
    dataRefreshed: "Data Refreshed",
    exportStarted: "Export Started",
  },
  error: {
    savingUser: "Error Saving User",
    deletingUser: "Error Deleting User",
    verifyingUser: "Error Verifying User",
    savingTeam: "Error Saving Team",
    deletingTeam: "Error Deleting Team",
    savingDepartment: "Error Saving Department",
    deletingDepartment: "Error Deleting Department",
    addingMember: "Error Adding Member",
    removingMember: "Error Removing Member",
    updatingRole: "Error Updating Role",
    creatingEvent: "Error Creating/Updating Event",
    deletingEvent: "Error Deleting Event",
    approvingEvent: "Error Approving Event",
    rejectingEvent: "Error Rejecting Event",
    savingProject: "Error Saving Project",
    deletingProject: "Error Deleting Project",
    updatingStatus: "Error Updating Status",
    approvingProject: "Error Approving Project",
    rejectingProject: "Error Rejecting Project",
    savingVlog: "Error Saving Vlog",
    deletingVlog: "Error Deleting Vlog",
    approvingVlog: "Error Approving Vlog",
    rejectingVlog: "Error Rejecting Vlog",
    refreshingData: "Could not refresh data.",
  },
  descriptions: {
    userVerified: "This will mark the user as verified.",
    userDeleted: "This will permanently delete the user.",
    teamDeleted: "This will permanently delete the team.",
    departmentDeleted: "This will permanently delete the department and its teams.",
    eventDeleted: (title: string) => `"${title}" has been removed.`,
    eventApproved: (title: string) => `"${title}" has been added to the calendar.`,
    eventRejected: (title: string) => `"${title}" has been rejected.`,
    projectSaved: (name: string) => `"${name}" has been saved successfully.`,
    projectDeleted: "The project has been removed successfully.",
    projectApproved: (name: string) => `"${name}" has been published.`,
    projectRejected: "The project submission has been rejected.",
    statusChanged: (status: string) => `Project status changed to ${status}.`,
    vlogSaved: (title: string) => `"${title}" has been saved successfully.`,
    vlogDeleted: "The vlog has been removed successfully.",
    vlogApproved: (title: string) => `"${title}" has been published.`,
    vlogRejected: "The vlog submission has been rejected.",
    dataRefreshed: "Latest data has been loaded.",
    exportReady: "Your data export will be available shortly.",
  },
} as const;

// ===== FORM DEFAULT VALUES =====

export const FORM_DEFAULTS = {
  user: {
    name: "",
    email: "",
  },
  team: {
    name: "",
    description: "",
    departmentId: "",
  },
  department: {
    name: "",
    description: "",
  },
  event: {
    title: "",
    description: "",
    date: "",
    time: "",
    duration: "60",
    type: "meeting" as EventType,
    location: "",
  },
  project: {
    name: "",
    slug: "",
    description: "",
    image: "",
    projectLink: "",
    githubLink: "",
    demoLink: "",
    type: "SOFTWARE" as ProjectType,
    tags: "",
    status: "published" as ContentStatus,
  },
  vlog: {
    title: "",
    slug: "",
    description: "",
    image: "",
    status: "published" as ContentStatus,
  },
} as const;

// ===== DIALOG TITLES & DESCRIPTIONS =====

export const DIALOG_CONTENT = {
  user: {
    add: {
      title: "Add New User",
      description: "Create a new user account.",
    },
    edit: {
      title: "Edit User",
      description: (name: string) => `Update the details for ${name}.`,
    },
  },
  team: {
    add: {
      title: "Create New Team",
      description: "Set up a new team within a department.",
    },
    edit: {
      title: "Edit Team",
      description: (name: string) => `Update the details for ${name}.`,
    },
  },
  department: {
    add: {
      title: "Create New Department",
      description: "Set up a new department.",
    },
    edit: {
      title: "Edit Department",
      description: (name: string) => `Update the details for ${name}.`,
    },
  },
  event: {
    add: {
      title: "Create New Event",
      description: "Add a new event to the calendar.",
    },
    edit: {
      title: "Edit Event",
      description: "Update the details for this event.",
    },
  },
  project: {
    add: {
      title: "Create New Project",
      description: "Add a new project to the platform.",
    },
    edit: {
      title: "Edit Project",
      description: "Update the project details.",
    },
  },
  vlog: {
    add: {
      title: "Create New Vlog",
      description: "Add a new vlog to the platform.",
    },
    edit: {
      title: "Edit Vlog",
      description: "Update the vlog details.",
    },
  },
  manageMembers: {
    title: (name: string) => `Manage Members for ${name}`,
    description: "Add, remove, and assign roles to members.",
  },
  confirmation: {
    delete: {
      title: "Are you sure?",
      description: "This action cannot be undone.",
    },
    verify: {
      title: "Confirm Action",
      description: "This will mark the user as verified.",
    },
  },
} as const;

// ===== STATS CARD LABELS =====

export const STATS_LABELS = {
  totalUsers: {
    title: "Total Users",
    icon: "Users",
    suffix: (pending: number) => `${pending} pending`,
  },
  activeTeams: {
    title: "Active Teams",
    icon: "Users",
    suffix: (total: number) => `${total} total`,
  },
  departments: {
    title: "Departments",
    icon: "Building2",
    suffix: "All active",
  },
} as const;

// ===== TAB CONFIGURATIONS =====

export const TAB_CONFIG = {
  tabs: [
    { value: "users", label: "Users" },
    { value: "teams", label: "Teams" },
    { value: "departments", label: "Departments" },
    { value: "calendar", label: "Calendar" },
    { value: "requests", label: "Requests" },
    { value: "projects", label: "Projects" },
    { value: "vlogs", label: "Vlogs" },
  ] as const,
  defaultTab: "users" as const,
} as const;

// ===== AVATAR FALLBACK GENERATOR =====

export const AVATAR_CONFIG = {
  defaultUrl: (id: string) => `https://i.pravatar.cc/150?u=${id}`,
  getInitials: (name: string) => name.charAt(0).toUpperCase(),
  size: {
    small: "h-6 w-6",
    medium: "h-9 w-9",
    large: "h-12 w-12",
  },
} as const;

// ===== LOADING STATES =====

export const LOADING_ACTIONS = {
  refresh: "refresh",
  export: "export",
  addUser: "add-user",
  editUser: (id: string) => `edit-${id}`,
  deleteUser: (id: string) => `delete-${id}`,
  verifyUser: (id: string) => `verify-${id}`,
  addTeam: "add-team",
  editTeam: (id: string) => `edit-${id}`,
  deleteTeam: (id: string) => `delete-${id}`,
  addDepartment: "add-department",
  editDepartment: (id: string) => `edit-${id}`,
  deleteDepartment: (id: string) => `delete-${id}`,
  acceptEvent: (id: string) => `accept-${id}`,
  rejectEvent: (id: string) => `reject-${id}`,
  addProject: "add-project",
  editProject: (id: string) => `edit-${id}`,
  deleteProject: (id: string) => `delete-${id}`,
  updateProjectStatus: (id: string) => `status-${id}`,
  approveProject: (id: string) => `approve-project-${id}`,
  rejectProject: (id: string) => `reject-project-${id}`,
  addVlog: "add-vlog",
  editVlog: (id: string) => `edit-${id}`,
  deleteVlog: (id: string) => `delete-${id}`,
  updateVlogStatus: (id: string) => `status-${id}`,
  approveVlog: (id: string) => `approve-vlog-${id}`,
  rejectVlog: (id: string) => `reject-vlog-${id}`,
} as const;

// ===== EMPTY STATE MESSAGES =====

export const EMPTY_STATES = {
  users: "No users found.",
  teams: "No teams found.",
  departments: "No departments found.",
  events: "No events scheduled for this day.",
  pendingEvents: "No pending event requests.",
  projects: "No projects found.",
  vlogs: "No vlogs found.",
  pendingRequests: "No pending requests.",
  members: "No members yet.",
  availableUsers: "No users available to add.",
} as const;

// ===== DATA TRANSFORMATION HELPERS =====

export const DATA_TRANSFORMERS = {
  normalizeRole: (
    role: string | undefined | null
  ): "user" | "manager" | "admin" => {
    if (!role) return "user";
    const normalized = role.toLowerCase();
    if (
      normalized === "user" ||
      normalized === "manager" ||
      normalized === "admin"
    ) {
      return normalized;
    }
    return "user";
  },
  normalizeMemberRole: (role: string | undefined | null): MembershipRole => {
    if (!role) return "member";
    const normalized = role.toLowerCase();
    return normalized === "manager" ? "manager" : "member";
  },
  formatDateString: (date: string | Date): string => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toISOString().split("T")[0];
  },
  parseTagsToArray: (tags: string | string[]): string[] => {
    if (Array.isArray(tags)) return tags;
    return tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  },
  parseTagsToString: (tags: string[]): string => {
    return tags.join(", ");
  },
  eventTypeToUI: (type: string): EventType => {
    const typeMap: Record<string, EventType> = {
      MEETING: "meeting",
      REVIEW: "review",
      PLANNING: "planning",
      WORKSHOP: "workshop",
    };
    return typeMap[type.toUpperCase()] || "meeting";
  },
  eventTypeToAPI: (type: EventType): string => {
    return type.toUpperCase();
  },
} as const;

// ===== VALIDATION PATTERNS =====

export const VALIDATION_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  time: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
  slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  url: /^https?:\/\/.+/,
} as const;

// ===== PAGINATION CONFIG =====

export const PAGINATION_CONFIG = {
  defaultPageSize: 10,
  pageSizeOptions: [10, 25, 50, 100],
} as const;

// ===== EXPORT FILENAME GENERATOR =====

export const EXPORT_FILENAMES = {
  allData: () => `itc-hub-data-${new Date().toISOString().split("T")[0]}.csv`,
  users: () => `users-${new Date().toISOString().split("T")[0]}.csv`,
  teams: () => `teams-${new Date().toISOString().split("T")[0]}.csv`,
  departments: () => `departments-${new Date().toISOString().split("T")[0]}.csv`,
  events: () => `events-${new Date().toISOString().split("T")[0]}.csv`,
  projects: () => `projects-${new Date().toISOString().split("T")[0]}.csv`,
  vlogs: () => `vlogs-${new Date().toISOString().split("T")[0]}.csv`,
} as const;