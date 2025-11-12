// /admin/page.tsx

import AdminClientPage from "./client";
import { headers } from "next/headers";
import { getAuthenticatedUser, isAdmin } from "@/lib/auth-helpers";
import type {
  User as AdminUser,
  Event as AdminEvent,
  Project,
  Vlog,
  PendingProject,
  PendingVlog,
} from "./types";
import { NotAccessible } from "@/components/NotAccessible";
// Helper function for authenticated server-side fetch requests
async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const headersList = await headers();
  const cookie = headersList.get("cookie");

  return fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(cookie && { Cookie: cookie }),
      ...options.headers,
    },
  });
}

// Type-safe API response interfaces
interface ApiUser {
  id: string;
  name: string;
  email: string;
  status: string;
  createdAt: string;
  avatar?: string;
  role: string;
}

interface ApiTeam {
  id: string;
  name: string;
  description?: string;
  leaders: ApiUser[];
  members: Array<{
    user: {
      id: string;
      name: string;
      avatar?: string;
    };
    role: string;
  }>;
  departmentId: string;
  createdAt: string;
  status?: string;
}

interface ApiDepartment {
  id: string;
  name: string;
  description?: string;
  color?: string;
  managers: ApiUser[];
  members: Array<{
    user: {
      id: string;
      name: string;
      avatar?: string;
    };
    role: string;
  }>;
  teams?: Array<{
    id: string;
    name: string;
  }>;
  createdAt: string;
  status?: string;
}

interface ApiEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  time?: string;
  duration?: number;
  type: string;
  status?: string;
  departmentId?: string | null;
  organizerId?: string | null;
  isRecurring?: boolean;
  teamId?: string | null;
  attendees?: Array<{
    id: string;
    name: string;
    avatar?: string;
  }>;
  location?: string;
  color?: string;
  organizer?: {
    id: string;
    name: string;
  };
}

interface ApiResponse<T> {
  data?: T[];
  users?: T[];
  teams?: T[];
  departments?: T[];
  events?: T[];
  projects?: Project[];
  vlogs?: Vlog[];
  pendingProjects?: PendingProject[];
  pendingVlogs?: PendingVlog[];
}

// Helper to convert role strings to lowercase for UI
const normalizeRole = (
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
};

export default async function AdminPage() {
  // Check if user has admin role
  const user = await getAuthenticatedUser();
  const isAdminUser = await isAdmin(user?.user.id || "");
  if (!isAdminUser) return NotAccessible();

  // Fetch data using direct API calls
  const [
    usersResponse,
    teamsResponse,
    departmentsResponse,
    eventsResponse,
    pendingEventsResponse,
    projectsResponse,
    vlogsResponse,
    pendingProjectsResponse,
    pendingVlogsResponse,
  ] = await Promise.all([
    authenticatedFetch("/api/admin/users"),
    authenticatedFetch("/api/admin/teams"),
    authenticatedFetch("/api/admin/departments"),
    authenticatedFetch("/api/admin/events"),
    authenticatedFetch("/api/admin/events/requests"),
    authenticatedFetch("/api/admin/projects"),
    authenticatedFetch("/api/admin/vlogs"),
    authenticatedFetch("/api/admin/projects/requests"),
    authenticatedFetch("/api/admin/vlogs/requests"),
  ]);

  // Parse all responses with type safety
  const [
    usersData,
    teamsData,
    departmentsData,
    eventsData,
    pendingEventsData,
    projectsData,
    vlogsData,
    pendingProjectsData,
    pendingVlogsData,
  ] = await Promise.all([
    usersResponse.ok
      ? (usersResponse.json() as Promise<ApiResponse<ApiUser>>)
      : Promise.resolve({ users: [] } as ApiResponse<ApiUser>),
    teamsResponse.ok
      ? (teamsResponse.json() as Promise<ApiResponse<ApiTeam>>)
      : Promise.resolve({ teams: [] } as ApiResponse<ApiTeam>),
    departmentsResponse.ok
      ? (departmentsResponse.json() as Promise<ApiResponse<ApiDepartment>>)
      : Promise.resolve({ departments: [] } as ApiResponse<ApiDepartment>),
    eventsResponse.ok
      ? (eventsResponse.json() as Promise<ApiResponse<ApiEvent>>)
      : Promise.resolve({ events: [] } as ApiResponse<ApiEvent>),
    pendingEventsResponse.ok
      ? (pendingEventsResponse.json() as Promise<ApiResponse<ApiEvent>>)
      : Promise.resolve({ events: [] } as ApiResponse<ApiEvent>),
    projectsResponse.ok
      ? (projectsResponse.json() as Promise<ApiResponse<Project>>)
      : Promise.resolve({ projects: [] } as ApiResponse<Project>),
    vlogsResponse.ok
      ? (vlogsResponse.json() as Promise<ApiResponse<Vlog>>)
      : Promise.resolve({ vlogs: [] } as ApiResponse<Vlog>),
    pendingProjectsResponse.ok
      ? (pendingProjectsResponse.json() as Promise<ApiResponse<PendingProject>>)
      : Promise.resolve({ pendingProjects: [] } as ApiResponse<PendingProject>),
    pendingVlogsResponse.ok
      ? (pendingVlogsResponse.json() as Promise<ApiResponse<PendingVlog>>)
      : Promise.resolve({ pendingVlogs: [] } as ApiResponse<PendingVlog>),
  ]);

  const users: ApiUser[] = usersData.users || [];
  const teams: ApiTeam[] = teamsData.teams || [];
  const departments: ApiDepartment[] = departmentsData.departments || [];
  const events: ApiEvent[] = eventsData.events || [];
  const pendingEvents: ApiEvent[] = pendingEventsData.events || [];
  const projects: Project[] = projectsData.projects || [];
  const vlogs: Vlog[] = vlogsData.vlogs || [];
  const pendingProjects: PendingProject[] =
    pendingProjectsData.pendingProjects || [];
  const pendingVlogs: PendingVlog[] = pendingVlogsData.pendingVlogs || [];

  // Transform users with proper role handling
  const initialUsers: AdminUser[] = users.map((user: ApiUser) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    status: (user.status === "verified" ? "verified" : "pending") as
      | "verified"
      | "pending",
    joinedDate: user.createdAt,
    avatar: user.avatar || `https://i.pravatar.cc/150?u=${user.id}`,
    role: normalizeRole(user.role),
  }));

  // Transform teams - ensure leaders have joinedDate
  const initialTeams = teams.map((team: ApiTeam) => {
    const transformedLeaders = (team.leaders || []).map((leader: ApiUser) => ({
      id: leader.id,
      name: leader.name,
      email: leader.email,
      status: (leader.status === "verified" ? "verified" : "pending") as
        | "verified"
        | "pending",
      joinedDate: leader.createdAt,
      avatar: leader.avatar || `https://i.pravatar.cc/150?u=${leader.id}`,
      role: normalizeRole(leader.role),
    }));

    return {
      id: team.id,
      name: team.name,
      description: team.description || "",
      leaders: transformedLeaders,
      members:
        team.members?.map((m) => ({
          userId: m.user.id,
          role: (m.role?.toLowerCase() === "manager" ? "manager" : "member") as
            | "manager"
            | "member",
          user: {
            id: m.user.id,
            name: m.user.name,
            avatar: m.user.avatar || null,
          },
        })) || [],
      departmentId: team.departmentId || "",
      createdDate: team.createdAt,
      status: (team.status === "archived" ? "archived" : "active") as
        | "active"
        | "archived",
    };
  });

  // Transform departments - ensure managers have joinedDate and add optional color
  const initialDepartments = departments.map((dept: ApiDepartment) => {
    const transformedManagers = (dept.managers || []).map(
      (manager: ApiUser) => ({
        id: manager.id,
        name: manager.name,
        email: manager.email,
        status: (manager.status === "verified" ? "verified" : "pending") as
          | "verified"
          | "pending",
        joinedDate: manager.createdAt,
        avatar: manager.avatar || `https://i.pravatar.cc/150?u=${manager.id}`,
        role: normalizeRole(manager.role),
      })
    );

    return {
      id: dept.id,
      name: dept.name,
      description: dept.description || "",
      managers: transformedManagers,
      members:
        dept.members?.map((m) => ({
          userId: m.user.id,
          role: (m.role?.toLowerCase() === "manager" ? "manager" : "member") as
            | "manager"
            | "member",
          user: {
            id: m.user.id,
            name: m.user.name,
            avatar: m.user.avatar || null,
          },
        })) || [],
      teams:
        dept.teams?.map((t) => ({
          id: t.id,
          name: t.name,
        })) || [],
      createdDate: dept.createdAt,
      status: (dept.status === "archived" ? "archived" : "active") as
        | "active"
        | "archived",
      color: dept.color,
    };
  });

  // Transform events - include all required optional fields
  const eventTypeMap = {
    meeting: "MEETING",
    review: "REVIEW",
    planning: "PLANNING",
    workshop: "WORKSHOP",
  } as const;

  const initialEvents: AdminEvent[] = events.map((event: ApiEvent) => ({
    id: event.id,
    title: event.title,
    description: event.description || "",
    date: event.date?.split("T")[0] || "",
    time: event.time || "09:00",
    duration: event.duration || 60,
    type:
      eventTypeMap[event.type?.toLowerCase() as keyof typeof eventTypeMap] ||
      "MEETING",
    attendees:
      event.attendees?.map((a) => ({
        id: a.id,
        name: a.name,
        avatar: a.avatar || null,
      })) || [],
    location: event.location || "Conference Room",
    color: event.color || "#3b82f6",
    status: event.status,
    departmentId: event.departmentId,
    organizerId: event.organizerId,
    isRecurring: event.isRecurring || false,
    teamId: event.teamId,
  }));

  // Transform pending events
  const initialPendingEvents = pendingEvents.map((event: ApiEvent) => ({
    id: event.id,
    title: event.title,
    description: event.description || "",
    date: event.date?.split("T")[0] || "",
    time: event.time || "09:00",
    duration: event.duration || 60,
    type: (event.type?.toLowerCase() || "meeting") as
      | "meeting"
      | "review"
      | "planning"
      | "workshop",
    location: event.location || "",
    submittedBy: event.organizer?.name || "Unknown",
    submittedByType: "user" as const,
  }));

  const initialProjects = projects.map((p) => ({
    ...p,
    status: p.status || "published",
  }));

  const initialVlogs = vlogs.map((v) => ({
    ...v,
    status: v.status || "published",
  }));

  return (
    <AdminClientPage
      initialUsers={initialUsers}
      initialTeams={initialTeams}
      initialDepartments={initialDepartments}
      initialEvents={initialEvents}
      initialPendingEvents={initialPendingEvents}
      initialProjects={initialProjects}
      initialVlogs={initialVlogs}
      initialPendingProjects={pendingProjects}
      initialPendingVlogs={pendingVlogs}
    />
  );
}
