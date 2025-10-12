import { useState, useMemo, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import type { Team, TeamFormData } from "./types";

import type {
  User,
  Department,
  Event,
  PendingEvent,
  ModalState,
  ModalDataPayload,
} from "./types";

import type { Member } from "./types";

import type { UserFormData, DepartmentFormData } from "./types";

import type { UpcomingEvent, EventFormData } from "./types";

// ===== IMPROVED API RESPONSE INTERFACES =====
interface UsersApiResponse {
  users: User[];
}

interface TeamsApiResponse {
  teams: Team[];
}

interface DepartmentsApiResponse {
  departments: Department[];
}

interface EventsApiResponse {
  events: Event[];
}

interface PendingEventsApiResponse {
  events: PendingEvent[];
}

interface ApiErrorResponse {
  error: string;
  message?: string;
}

// ===== IMPROVED API REQUEST HELPER =====
async function apiRequest<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = (await response
      .json()
      .catch(() => ({ error: "An unknown error occurred" }))) as ApiErrorResponse;
    throw new Error(errorData.error || "Request failed");
  }

  if (response.status === 204) {
    return null as T;
  }

  return response.json() as Promise<T>;
}

// ===== IMPROVED TRANSFORM FUNCTION WITH EVENT SUPPORT =====
function transformApiResponse<T extends User | Team | Department | Event | PendingEvent>(
  item: T,
  type: "user" | "team" | "department" | "event" | "pendingevent"
): T {
  switch (type) {
    case "user": {
      const user = item as User;
      return {
        ...user,
        joinedDate: user.joinedDate || new Date().toISOString(),
        avatar: user.avatar || `https://i.pravatar.cc/150?u=${user.id}`,
      } as T;
    }

    case "team": {
      const team = item as Team;
      return {
        ...team,
        createdDate: team.createdDate || new Date().toISOString(),
        status: (team.status || "active") as "active" | "archived",
      } as T;
    }

    case "department": {
      const dept = item as Department;
      return {
        ...dept,
        createdDate: dept.createdDate || new Date().toISOString(),
        status: (dept.status || "active") as "active" | "archived",
        color: dept.color || "#f3f4f6",
      } as T;
    }

    case "event": {
      const event = item as Event;
      return {
        ...event,
        date: event.date || new Date().toISOString().split("T")[0],
        type: event.type || "meeting",
        color: event.color || "#3b82f6",
      } as T;
    }

    case "pendingevent": {
      const pendingEvent = item as PendingEvent;
      return {
        ...pendingEvent,
        date: pendingEvent.date || new Date().toISOString().split("T")[0],
        type: pendingEvent.type || "meeting",
      } as T;
    }

    default:
      return item;
  }
}

/**
 * @hook useAdminPage
 * @description The main hook for the Admin Page, composing all other hooks.
 * @param initialData - The initial data for the admin page.
 * @returns {object} - All the state and handlers needed by the AdminClientPage component.
 */
export const useAdminPage = (
  initialUsers: User[],
  initialTeams: Team[],
  initialDepartments: Department[],
  initialEvents: Event[],
  initialPendingEvents: PendingEvent[]
) => {
  const { toast } = useToast();
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState | null>(null);

  const {
    users,
    setUsers,
    handleSaveUser,
    handleDeleteUser,
    handleVerifyUser,
    loadingAction: userLoadingAction,
  } = useUsers(initialUsers);
  const {
    teams,
    setTeams,
    handleSaveTeam,
    handleDeleteTeam,
    loadingAction: teamLoadingAction,
  } = useTeams(initialTeams);
  const {
    departments,
    setDepartments,
    handleSaveDepartment,
    handleDeleteDepartment,
    loadingAction: departmentLoadingAction,
  } = useDepartments(initialDepartments, setTeams);
  const calendarData = useCalendar(initialEvents);
  const {
    pendingEvents,
    setPendingEvents,
    handleAcceptEvent,
    handleRejectEvent,
    loadingAction: eventRequestLoadingAction,
  } = useEventRequests(initialPendingEvents, calendarData.setAllEvents);

  const handleRefreshData = useCallback(async () => {
    setLoadingAction("refresh");
    try {
      const [usersData, teamsData, deptsData, eventsData, pendingEventsData] =
        await Promise.all([
          apiRequest<UsersApiResponse>("/api/admin/users"),
          apiRequest<TeamsApiResponse>("/api/admin/teams"),
          apiRequest<DepartmentsApiResponse>("/api/admin/departments"),
          apiRequest<EventsApiResponse>("/api/admin/events"),
          apiRequest<PendingEventsApiResponse>("/api/admin/events/requests"),
        ]);

      setUsers(usersData.users.map((u: User) => transformApiResponse(u, "user")));
      setTeams(teamsData.teams.map((t: Team) => transformApiResponse(t, "team")));
      setDepartments(
        deptsData.departments.map((d: Department) => transformApiResponse(d, "department"))
      );
      calendarData.setAllEvents(
        eventsData.events.map((e: Event) => transformApiResponse(e, "event"))
      );
      setPendingEvents(
        pendingEventsData.events.map((e: PendingEvent) => transformApiResponse(e, "pendingevent"))
      );

      toast({
        title: "Data Refreshed",
        description: "Latest data has been loaded.",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Could not refresh data.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoadingAction(null);
    }
  }, [
    toast,
    setUsers,
    setTeams,
    setDepartments,
    calendarData,
    setPendingEvents,
  ]);

  const { handleAddMember, handleRemoveMember, handleChangeMemberRole } =
    useMembers(handleRefreshData);

  const closeModal = () => setModal(null);

  const handleActionConfirm = () => {
    if (!modal || !modal.data) return;
    const { view, data } = modal;

    const actions: Record<string, (id: string) => Promise<void>> = {
      DELETE_USER: handleDeleteUser,
      VERIFY_USER: handleVerifyUser,
      DELETE_TEAM: handleDeleteTeam,
      DELETE_DEPARTMENT: handleDeleteDepartment,
    };

    if (actions[view]) {
      actions[view](data.id).finally(closeModal);
    }
  };

  const handleExportData = async () => {
    setLoadingAction("export");
    toast({
      title: "Export Started",
      description: "Your data export will be available shortly.",
    });
    await new Promise((res) => setTimeout(res, 1200));
    setLoadingAction(null);
  };

  const entityForDialog = useMemo(() => {
    if (
      modal?.view !== "MANAGE_MEMBERS" ||
      !modal.data ||
      !("entityType" in (modal.data as ModalDataPayload))
    ) {
      return null;
    }

    const data = modal.data as { entityType: 'team' | 'department', id: string };

    const entity =
      data.entityType === "team"
        ? teams.find((t) => t.id === data.id)
        : departments.find((d) => d.id === data.id);

    return entity ? { ...entity, entityType: data.entityType } : null;
  }, [modal, teams, departments]);

  const userForEdit = useMemo(
    () =>
      modal?.view === "EDIT_USER"
        ? users.find((u) => u.id === modal.data!.id)
        : null,
    [modal, users]
  );
  const teamForEdit = useMemo(
    () =>
      modal?.view === "EDIT_TEAM"
        ? teams.find((t) => t.id === modal.data!.id)
        : null,
    [modal, teams]
  );
  const departmentForEdit = useMemo(
    () =>
      modal?.view === "EDIT_DEPARTMENT"
        ? departments.find((d) => d.id === modal.data!.id)
        : null,
    [modal, departments]
  );

  return {
    pageActions: {
      handleRefreshData,
      handleExportData,
      loadingAction:
        loadingAction ||
        userLoadingAction ||
        teamLoadingAction ||
        departmentLoadingAction ||
        eventRequestLoadingAction,
    },
    modalData: {
      modal,
      setModal,
      closeModal,
      handleActionConfirm,
      entityForDialog,
      userForEdit,
      teamForEdit,
      departmentForEdit,
    },
    userData: {
      users,
      handleSaveUser,
      isUserFormLoading:
        userLoadingAction === "add-user" ||
        userLoadingAction?.startsWith("edit-"),
    },
    teamData: {
      teams,
      handleSaveTeam,
      isTeamFormLoading:
        teamLoadingAction === "add-team" ||
        teamLoadingAction?.startsWith("edit-"),
    },
    departmentData: {
      departments,
      handleSaveDepartment,
      isDeptFormLoading:
        departmentLoadingAction === "add-department" ||
        departmentLoadingAction?.startsWith("edit-"),
    },
    memberData: {
      handleAddMember,
      handleRemoveMember,
      handleChangeMemberRole,
    },
    eventRequestData: {
      pendingEvents,
      handleAcceptEvent,
      handleRejectEvent,
    },
    calendarData,
    allUsers: users,
    allDepartments: departments,
  };
};

/**
 * @hook useUsers
 * @description Manages state and actions related to users.
 * @param {User[]} initialUsers - The initial list of users.
 * @returns {object} - The users state and action handlers.
 */
export const useUsers = (initialUsers: User[]) => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const handleSaveUser = async (data: UserFormData & { id?: string }) => {
    const isEdit = !!data.id;
    const url = isEdit ? `/api/admin/users/${data.id}` : "/api/admin/users";
    const method = isEdit ? "PUT" : "POST";
    setLoadingAction(isEdit ? `edit-${data.id}` : "add-user");

    try {
      const savedUserData = await apiRequest<User>(url, { method, body: JSON.stringify(data) });
      const savedUser = transformApiResponse(savedUserData, 'user');

      if (isEdit) {
        setUsers((prev) => prev.map((u) => (u.id === savedUser.id ? savedUser : u)));
      } else {
        setUsers((prev) => [savedUser, ...prev]);
      }
      toast({ title: isEdit ? "User Updated" : "User Added" });
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not save user details.";
      toast({ title: "Error", description: message, variant: "destructive" });
      return false;
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    setLoadingAction(`delete-${userId}`);
    const originalUsers = users;
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    try {
      await apiRequest<void>(`/api/admin/users/${userId}`, { method: "DELETE" });
      toast({ title: "User Deleted" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error Deleting User";
      toast({ title: "Error Deleting User", description: message, variant: "destructive" });
      setUsers(originalUsers);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleVerifyUser = async (userId: string) => {
    setLoadingAction(`verify-${userId}`);
    try {
      const updatedUserData = await apiRequest<User>(`/api/admin/users/${userId}/verify`, { method: "POST" });
      const updatedUser = transformApiResponse(updatedUserData, 'user');
      setUsers((prev) => prev.map((u) => (u.id === userId ? updatedUser : u)));
      toast({ title: "User Verified" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error Verifying User";
      toast({ title: "Error Verifying User", description: message, variant: "destructive" });
    } finally {
      setLoadingAction(null);
    }
  };

  return {
    users,
    setUsers,
    loadingAction,
    handleSaveUser,
    handleDeleteUser,
    handleVerifyUser,
  };
};

/**
 * @hook useTeams
 * @description Manages state and actions related to teams.
 * @param {Team[]} initialTeams - The initial list of teams.
 * @returns {object} - The teams state and action handlers.
 */
export const useTeams = (initialTeams: Team[]) => {
  const { toast } = useToast();
  const [teams, setTeams] = useState<Team[]>(initialTeams);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const handleSaveTeam = async (data: TeamFormData & { id?: string }) => {
    const isEdit = !!data.id;
    const url = isEdit ? `/api/admin/teams/${data.id}` : "/api/admin/teams";
    const method = isEdit ? "PUT" : "POST";
    setLoadingAction(isEdit ? `edit-${data.id}` : "add-team");

    try {
      const savedTeamData = await apiRequest<Team>(url, { method, body: JSON.stringify(data) });
      const savedTeam = transformApiResponse(savedTeamData, 'team');

      if (isEdit) {
        setTeams((prev) => prev.map((t) => (t.id === savedTeam.id ? { ...t, ...savedTeam } : t)));
      } else {
        setTeams((prev) => [savedTeam, ...prev]);
      }
      toast({ title: isEdit ? "Team Updated" : "Team Created" });
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error Saving Team";
      toast({ title: "Error Saving Team", description: message, variant: "destructive" });
      return false;
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDeleteTeam = async (teamId: string) => {
    setLoadingAction(`delete-${teamId}`);
    const originalTeams = teams;
    setTeams((prev) => prev.filter((t) => t.id !== teamId));
    try {
      await apiRequest<void>(`/api/admin/teams/${teamId}`, { method: "DELETE" });
      toast({ title: "Team Deleted" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error Deleting Team";
      toast({ title: "Error Deleting Team", description: message, variant: "destructive" });
      setTeams(originalTeams);
    } finally {
      setLoadingAction(null);
    }
  };

  return {
    teams,
    setTeams,
    loadingAction,
    handleSaveTeam,
    handleDeleteTeam,
  };
};

/**
 * @hook useMembers
 * @description Provides functions for managing team and department members.
 * @param {() => void} handleRefreshData - A function to refresh all page data after a member action.
 * @returns {object} - Functions for adding, removing, and updating member roles.
 */
export const useMembers = (handleRefreshData: () => void) => {
  const { toast } = useToast();

  const handleAddMember = async (
    entityId: string,
    entityType: "team" | "department",
    userId: string,
    role: Member["role"]
  ) => {
    const roleToSend = role.toUpperCase();
    try {
      await apiRequest<void>(`/api/admin/${entityType}s/${entityId}/members`, {
        method: "POST",
        body: JSON.stringify({ userId, role: roleToSend }),
      });
      handleRefreshData();
      toast({ title: "Member Added" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error Adding Member";
      toast({ title: "Error Adding Member", description: message, variant: "destructive" });
    }
  };

  const handleRemoveMember = async (
    entityId: string,
    entityType: "team" | "department",
    userId: string
  ) => {
    try {
      await apiRequest<void>(`/api/admin/${entityType}s/${entityId}/members/${userId}`, { method: "DELETE" });
      handleRefreshData();
      toast({ title: "Member Removed" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error Removing Member";
      toast({ title: "Error Removing Member", description: message, variant: "destructive" });
    }
  };

  const handleChangeMemberRole = async (
    entityId: string,
    entityType: "team" | "department",
    userId: string,
    newRole: Member["role"]
  ) => {
    const roleToSend = newRole.toUpperCase();
    try {
      await apiRequest<void>(`/api/admin/${entityType}s/${entityId}/members/${userId}`, {
        method: "PUT",
        body: JSON.stringify({ role: roleToSend }),
      });
      handleRefreshData();
      toast({ title: "Member Role Updated" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error Updating Role";
      toast({ title: "Error Updating Role", description: message, variant: "destructive" });
    }
  };

  return {
    handleAddMember,
    handleRemoveMember,
    handleChangeMemberRole,
  };
};

/**
 * @hook useEventRequests
 * @description Manages state and actions for pending event requests.
 * @param {PendingEvent[]} initialPendingEvents - The initial list of pending events.
 * @param {React.Dispatch<React.SetStateAction<Event[]>>} setAllEvents - Function to update the main event list.
 * @returns {object} - The pending events state and action handlers.
 */
export const useEventRequests = (
  initialPendingEvents: PendingEvent[],
  setAllEvents: React.Dispatch<React.SetStateAction<Event[]>>
) => {
  const { toast } = useToast();
  const [pendingEvents, setPendingEvents] = useState<PendingEvent[]>(initialPendingEvents);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const handleAcceptEvent = async (eventToAccept: PendingEvent) => {
    setLoadingAction(`accept-${eventToAccept.id}`);
    try {
      const acceptedEventData = await apiRequest<Event>(`/api/admin/events/requests/${eventToAccept.id}/approve`, { method: "POST" });
      const acceptedEvent = transformApiResponse(acceptedEventData, 'event');

      setAllEvents((prev) => [...prev, acceptedEvent]);
      setPendingEvents((prev) => prev.filter((e) => e.id !== eventToAccept.id));
      toast({ title: "Event Approved", description: `"${eventToAccept.title}" has been added to the calendar.` });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not approve the event.";
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleRejectEvent = async (eventToReject: PendingEvent) => {
    setLoadingAction(`reject-${eventToReject.id}`);
    try {
      await apiRequest<void>(`/api/admin/events/requests/${eventToReject.id}/reject`, { method: "POST" });
      setPendingEvents((prev) => prev.filter((e) => e.id !== eventToReject.id));
      toast({ title: "Event Rejected", description: `"${eventToReject.title}" has been rejected.`, variant: "destructive" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not reject the event.";
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setLoadingAction(null);
    }
  };

  return {
    pendingEvents,
    setPendingEvents,
    loadingAction,
    handleAcceptEvent,
    handleRejectEvent,
  };
};

/**
 * @hook useDepartments
 * @description Manages state and actions related to departments.
 * @param {Department[]} initialDepartments - The initial list of departments.
 * @param {React.Dispatch<React.SetStateAction<Team[]>>} setTeams - A function to update the teams state.
 * @returns {object} - The departments state and action handlers.
 */
export const useDepartments = (
  initialDepartments: Department[],
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>
) => {
  const { toast } = useToast();
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const handleSaveDepartment = async (data: DepartmentFormData & { id?: string }) => {
    const isEdit = !!data.id;
    const url = isEdit ? `/api/admin/departments/${data.id}` : "/api/admin/departments";
    const method = isEdit ? "PUT" : "POST";
    setLoadingAction(isEdit ? `edit-${data.id}` : "add-department");

    try {
      const savedDeptData = await apiRequest<Department>(url, { method, body: JSON.stringify(data) });
      const savedDept = transformApiResponse(savedDeptData, 'department');

      if (isEdit) {
        setDepartments((prev) => prev.map((d) => (d.id === savedDept.id ? { ...d, ...savedDept } : d)));
      } else {
        setDepartments((prev) => [savedDept, ...prev]);
      }
      toast({ title: isEdit ? "Department Updated" : "Department Created" });
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error Saving Department";
      toast({ title: "Error Saving Department", description: message, variant: "destructive" });
      return false;
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDeleteDepartment = async (deptId: string) => {
    setLoadingAction(`delete-${deptId}`);
    const originalDepts = departments;
    setDepartments((prev) => prev.filter((d) => d.id !== deptId));
    setTeams((prev) => prev.filter((t) => t.departmentId !== deptId));
    try {
      await apiRequest<void>(`/api/admin/departments/${deptId}`, { method: "DELETE" });
      toast({ title: "Department Deleted" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error Deleting Department";
      toast({ title: "Error Deleting Department", description: message, variant: "destructive" });
      setDepartments(originalDepts);
    } finally {
      setLoadingAction(null);
    }
  };

  return {
    departments,
    setDepartments,
    loadingAction,
    handleSaveDepartment,
    handleDeleteDepartment,
  };
};

/**
 * @hook useCalendar
 * @description Manages all state and logic for the calendar and events.
 * @param {Event[]} initialEvents - The initial list of events.
 * @returns {object} - Calendar state, event data, and action handlers.
 */
export const useCalendar = (initialEvents: Event[]) => {
  const { toast } = useToast();
  const [allEvents, setAllEvents] = useState<Event[]>(initialEvents);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState<"month" | "week" | "day">("month");
  const [showNewEventDialog, setShowNewEventDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isCalendarLoading, setIsCalendarLoading] = useState(false);
  const [calendarFilterType, setCalendarFilterType] = useState<string>("all");

  const upcomingEvents = useMemo(() => {
    const now = new Date();
    return allEvents
      .map(event => ({ ...event, dateTime: new Date(`${event.date}T${event.time}`) }))
      .filter(event => event.dateTime >= now)
      .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime())
      .slice(0, 5)
      .map((event): UpcomingEvent => ({
        id: event.id,
        title: event.title,
        date: new Date(`${event.date}T${event.time}`).toLocaleString(),
        type: event.type,
        attendees: event.attendees.length,
      }));
  }, [allEvents]);

  const filteredEvents = useMemo(() => {
    if (calendarFilterType === "all") return allEvents;
    return allEvents.filter((event) => event.type === calendarFilterType);
  }, [allEvents, calendarFilterType]);

  const navigateCalendar = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      const d = direction === "prev" ? -1 : 1;
      if (calendarView === "month") newDate.setMonth(prev.getMonth() + d);
      if (calendarView === "week") newDate.setDate(prev.getDate() + (d * 7));
      if (calendarView === "day") newDate.setDate(prev.getDate() + d);
      return newDate;
    });
  };

  const handleDayClick = (date: Date) => {
    setCurrentDate(date);
    setCalendarView("day");
  };

  const createEvent = async (data: EventFormData & { id?: string }): Promise<boolean> => {
    const isEdit = !!data.id;
    const url = isEdit ? `/api/admin/events/${data.id}` : "/api/admin/events";
    const method = isEdit ? "PUT" : "POST";
    setIsCalendarLoading(true);

    try {
      const savedEventData = await apiRequest<Event>(url, { method, body: JSON.stringify(data) });
      const savedEvent = transformApiResponse(savedEventData, 'event');

      if (isEdit) {
        setAllEvents((prev) => prev.map((e) => (e.id === savedEvent.id ? savedEvent : e)));
      } else {
        setAllEvents((prev) => [...prev, savedEvent]);
      }
      toast({ title: isEdit ? "Event Updated" : "Event Created" });
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error Creating/Updating Event";
      toast({ title: "Error Creating/Updating Event", description: message, variant: "destructive" });
      return false;
    } finally {
      setIsCalendarLoading(false);
    }
  };

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setShowNewEventDialog(true);
  };

  const handleDeleteEvent = async (event: Event) => {
    setIsCalendarLoading(true);
    const originalEvents = allEvents;
    setAllEvents((prev) => prev.filter((e) => e.id !== event.id));
    setSelectedEvent(null);
    try {
      await apiRequest<void>(`/api/admin/events/${event.id}`, { method: "DELETE" });
      toast({ title: "Event Deleted", description: `"${event.title}" has been removed.` });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error Deleting Event";
      toast({ title: "Error Deleting Event", description: message, variant: "destructive" });
      setAllEvents(originalEvents);
    } finally {
      setIsCalendarLoading(false);
    }
  };

  const formatDate = (date: Date, view: "month" | "week" | "day"): string => {
    if (view === 'day') return date.toLocaleDateString("en-US", { weekday: 'long', month: "long", day: "numeric", year: "numeric" });
    if (view === 'week') {
      const start = new Date(date);
      start.setDate(date.getDate() - date.getDay());
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      return `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
    }
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };
  
  const getDaysInMonth = (date: Date): number => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date: Date): number => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const formatDateString = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return {
    allEvents,
    setAllEvents,
    view: calendarView,
    currentDate,
    events: filteredEvents,
    upcomingEvents,
    showNewEventDialog,
    selectedEvent,
    isLoading: isCalendarLoading,
    filterType: calendarFilterType,
    actions: {
      setView: setCalendarView,
      navigate: navigateCalendar,
      createEvent,
      setSelectedEvent,
      setShowNewEventDialog,
      setFilterType: setCalendarFilterType,
      handleDayClick,
      handleEditEvent,
      handleDeleteEvent,
    },
    utils: {
      formatDate: (date: Date) => formatDate(date, calendarView),
      getDaysInMonth,
      getFirstDayOfMonth,
      formatDateString,
    },
  };
};