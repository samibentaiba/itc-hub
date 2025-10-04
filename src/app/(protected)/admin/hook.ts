/**
 * Custom hook for managing the state and logic of the Admin Page.
 * This hook encapsulates all the business logic, API calls, and state management
 * required for the admin dashboard, separating concerns from the UI components.
 */
"use client";

import { useState, useMemo, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import type {
  User,
  Team,
  Department,
  Member,
  ModalState,
  LoadingAction,
  Event,
  UpcomingEvent,
  EventFormData,
  UserFormData,
  TeamFormData,
  DepartmentFormData,
  PendingEvent,
} from "./types";

// Helper for API calls
async function apiRequest(url: string, options: RequestInit = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: "An unknown error occurred" }));
    throw new Error(errorData.error || "Request failed");
  }
  if (response.status === 204) {
    return null;
  }
  return response.json();
}


export const useAdminPage = (
  initialUsers: User[],
  initialTeams: Team[],
  initialDepartments: Department[],
  initialEvents: Event[],
  initialUpcomingEvents: UpcomingEvent[],
  initialPendingEvents: PendingEvent[]
) => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [teams, setTeams] = useState<Team[]>(initialTeams);
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [loadingAction, setLoadingAction] = useState<LoadingAction>(null);
  const [modal, setModal] = useState<ModalState | null>(null);
  const [pendingEvents, setPendingEvents] = useState<PendingEvent[]>(initialPendingEvents);
  const [allEvents, setAllEvents] = useState<Event[]>(initialEvents);

  const upcomingEvents = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    return allEvents
      .map(event => ({ ...event, dateTime: new Date(`${event.date}T${event.time}`) }))
      .filter(event => event.dateTime >= now)
      .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime())
      .slice(0, 5)
      .map((event): UpcomingEvent => ({
        id: event.id,
        title: event.title,
        date: new Date(`${event.date}T${event.time}`).toLocaleDateString(),
        type: event.type,
        attendees: event.attendees.length,
      }));
  }, [allEvents]);

  const [currentDate, setCurrentDate] = useState(new Date("2025-08-01"));
  const [calendarView, setCalendarView] = useState<"month" | "week" | "day">("month");
  const [showNewEventDialog, setShowNewEventDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isCalendarLoading, setIsCalendarLoading] = useState(false);
  const [calendarFilterType, setCalendarFilterType] = useState<string>("all");

  const closeModal = () => setModal(null);

  const handleActionConfirm = () => {
    if (!modal || !modal.data) return;
    const { view, data } = modal;

    const actions: Record<string, (id: string) => Promise<any>> = {
      DELETE_USER: handleDeleteUser,
      VERIFY_USER: handleVerifyUser,
      DELETE_TEAM: handleDeleteTeam,
      DELETE_DEPARTMENT: handleDeleteDepartment,
    };

    if (actions[view]) {
      actions[view](data.id).finally(closeModal);
    }
  };

  // --- DATA TRANSFORMATION ---
  const transformApiResponse = (item: any, type: 'user' | 'team' | 'department' | 'event') => {
    switch (type) {
      case 'user':
        return { ...item, joinedDate: item.createdAt, avatar: item.avatar || `https://i.pravatar.cc/150?u=${item.id}` };
      case 'team':
        return { ...item, createdDate: item.createdAt, status: 'active', leader: item.leader };
      case 'department':
        return { ...item, createdDate: item.createdAt, status: 'active', manager: item.manager };
      case 'event':
        return {
          ...item,
          date: new Date(item.date).toISOString().split('T')[0],
          type: item.type.toLowerCase(),
          attendees: item.attendees?.map((a: any) => a.name) || [],
          color: item.color || '#3b82f6',
        };
      default:
        return item;
    }
  };

  // --- EVENT REQUEST HANDLERS ---
  const handleAcceptEvent = async (eventToAccept: PendingEvent) => {
    setLoadingAction(`accept-${eventToAccept.id}`);
    try {
      const acceptedEventData = await apiRequest(`/api/admin/events/requests/${eventToAccept.id}/approve`, { method: "POST" });
      const acceptedEvent = transformApiResponse(acceptedEventData, 'event');
      
      setAllEvents((prev) => [...prev, acceptedEvent]);
      setPendingEvents((prev) => prev.filter((e) => e.id !== eventToAccept.id));
      toast({ title: "Event Approved", description: `"${eventToAccept.title}" has been added to the calendar.` });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Could not approve the event.", variant: "destructive" });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleRejectEvent = async (eventToReject: PendingEvent) => {
    setLoadingAction(`reject-${eventToReject.id}`);
    try {
      await apiRequest(`/api/admin/events/requests/${eventToReject.id}/reject`, { method: "POST" });
      setPendingEvents((prev) => prev.filter((e) => e.id !== eventToReject.id));
      toast({ title: "Event Rejected", description: `"${eventToReject.title}" has been rejected.`, variant: "destructive" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Could not reject the event.", variant: "destructive" });
    } finally {
      setLoadingAction(null);
    }
  };

  // --- USER HANDLERS ---
  const handleSaveUser = async (data: UserFormData & { id?: string }) => {
    const isEdit = !!data.id;
    const url = isEdit ? `/api/admin/users/${data.id}` : "/api/admin/users";
    const method = isEdit ? "PUT" : "POST";
    setLoadingAction(isEdit ? `edit-${data.id}` : "add-user");

    try {
      const savedUserData = await apiRequest(url, { method, body: JSON.stringify(data) });
      const savedUser = transformApiResponse(savedUserData, 'user');

      if (isEdit) {
        setUsers((prev) => prev.map((u) => (u.id === savedUser.id ? savedUser : u)));
      } else {
        setUsers((prev) => [savedUser, ...prev]);
      }
      toast({ title: isEdit ? "User Updated" : "User Added" });
      return true;
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Could not save user details.", variant: "destructive" });
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
      await apiRequest(`/api/admin/users/${userId}`, { method: "DELETE" });
      toast({ title: "User Deleted" });
    } catch (error: any) {
      toast({ title: "Error Deleting User", description: error.message, variant: "destructive" });
      setUsers(originalUsers);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleVerifyUser = async (userId: string) => {
    setLoadingAction(`verify-${userId}`);
    try {
      const updatedUserData = await apiRequest(`/api/admin/users/${userId}/verify`, { method: "POST" });
      const updatedUser = transformApiResponse(updatedUserData, 'user');
      setUsers((prev) => prev.map((u) => (u.id === userId ? updatedUser : u)));
      toast({ title: "User Verified" });
    } catch (error: any) {
      toast({ title: "Error Verifying User", description: error.message, variant: "destructive" });
    } finally {
      setLoadingAction(null);
    }
  };

  // --- TEAM HANDLERS ---
  const handleSaveTeam = async (data: TeamFormData & { id?: string }) => {
    const isEdit = !!data.id;
    const url = isEdit ? `/api/admin/teams/${data.id}` : "/api/admin/teams";
    const method = isEdit ? "PUT" : "POST";
    setLoadingAction(isEdit ? `edit-${data.id}` : "add-team");

    try {
      const savedTeamData = await apiRequest(url, { method, body: JSON.stringify(data) });
      const savedTeam = transformApiResponse(savedTeamData, 'team');

      if (isEdit) {
        setTeams((prev) => prev.map((t) => (t.id === savedTeam.id ? { ...t, ...savedTeam } : t)));
      } else {
        setTeams((prev) => [savedTeam, ...prev]);
      }
      toast({ title: isEdit ? "Team Updated" : "Team Created" });
      return true;
    } catch (error: any) {
      toast({ title: "Error Saving Team", description: error.message, variant: "destructive" });
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
      await apiRequest(`/api/admin/teams/${teamId}`, { method: "DELETE" });
      toast({ title: "Team Deleted" });
    } catch (error: any) {
      toast({ title: "Error Deleting Team", description: error.message, variant: "destructive" });
      setTeams(originalTeams);
    } finally {
      setLoadingAction(null);
    }
  };

  // --- DEPARTMENT HANDLERS ---
  const handleSaveDepartment = async (data: DepartmentFormData & { id?: string }) => {
    const isEdit = !!data.id;
    const url = isEdit ? `/api/admin/departments/${data.id}` : "/api/admin/departments";
    const method = isEdit ? "PUT" : "POST";
    setLoadingAction(isEdit ? `edit-${data.id}` : "add-department");

    try {
      const savedDeptData = await apiRequest(url, { method, body: JSON.stringify(data) });
      const savedDept = transformApiResponse(savedDeptData, 'department');

      if (isEdit) {
        setDepartments((prev) => prev.map((d) => (d.id === savedDept.id ? { ...d, ...savedDept } : d)));
      } else {
        setDepartments((prev) => [savedDept, ...prev]);
      }
      toast({ title: isEdit ? "Department Updated" : "Department Created" });
      return true;
    } catch (error: any) {
      toast({ title: "Error Saving Department", description: error.message, variant: "destructive" });
      return false;
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDeleteDepartment = async (deptId: string) => {
    setLoadingAction(`delete-${deptId}`);
    const originalDepts = departments;
    const originalTeams = teams;
    setDepartments((prev) => prev.filter((d) => d.id !== deptId));
    setTeams((prev) => prev.filter((t) => t.departmentId !== deptId)); // Also remove teams from UI
    try {
      await apiRequest(`/api/admin/departments/${deptId}`, { method: "DELETE" });
      toast({ title: "Department Deleted" });
    } catch (error: any) {
      toast({ title: "Error Deleting Department", description: error.message, variant: "destructive" });
      setDepartments(originalDepts);
      setTeams(originalTeams);
    } finally {
      setLoadingAction(null);
    }
  };

  // --- MEMBER MANAGEMENT ---
  const handleAddMember = async (entityId: string, entityType: "team" | "department", userId: string, role: Member["role"]) => {
    const roleToSend = role.toUpperCase(); // LEADER or MEMBER
    try {
      await apiRequest(`/api/admin/${entityType}s/${entityId}/members`, {
        method: "POST",
        body: JSON.stringify({ userId, role: roleToSend }),
      });
      // Refresh data to get updated member list
      handleRefreshData();
      toast({ title: "Member Added" });
    } catch (error: any) {
      toast({ title: "Error Adding Member", description: error.message, variant: "destructive" });
    }
  };

  const handleRemoveMember = async (entityId: string, entityType: "team" | "department", userId: string) => {
    try {
      await apiRequest(`/api/admin/${entityType}s/${entityId}/members/${userId}`, { method: "DELETE" });
      handleRefreshData();
      toast({ title: "Member Removed" });
    } catch (error: any) {
      toast({ title: "Error Removing Member", description: error.message, variant: "destructive" });
    }
  };

  const handleChangeMemberRole = async (entityId: string, entityType: "team" | "department", userId: string, newRole: Member["role"]) => {
    const roleToSend = newRole.toUpperCase();
    try {
      await apiRequest(`/api/admin/${entityType}s/${entityId}/members/${userId}`, {
        method: "PUT",
        body: JSON.stringify({ role: roleToSend }),
      });
      handleRefreshData();
      toast({ title: "Member Role Updated" });
    } catch (error: any) {
      toast({ title: "Error Updating Role", description: error.message, variant: "destructive" });
    }
  };

  // --- DATA REFRESH ---
  const handleRefreshData = useCallback(async () => {
    setLoadingAction("refresh");
    try {
      const [usersData, teamsData, deptsData, eventsData, pendingEventsData] = await Promise.all([
        apiRequest('/api/admin/users'),
        apiRequest('/api/admin/teams'),
        apiRequest('/api/admin/departments'),
        apiRequest('/api/admin/events'),
        apiRequest('/api/admin/events/requests'),
      ]);

      setUsers(usersData.users.map((u: any) => transformApiResponse(u, 'user')));
      setTeams(teamsData.teams.map((t: any) => transformApiResponse(t, 'team')));
      setDepartments(deptsData.departments.map((d: any) => transformApiResponse(d, 'department')));
      setAllEvents(eventsData.events.map((e: any) => transformApiResponse(e, 'event')));
      setPendingEvents(pendingEventsData.events.map((e: any) => transformApiResponse(e, 'event')));

      toast({ title: "Data Refreshed", description: "Latest data has been loaded." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Could not refresh data.", variant: "destructive" });
    } finally {
      setLoadingAction(null);
    }
  }, [toast]);

  const handleExportData = async () => {
    setLoadingAction("export");
    toast({ title: "Export Started", description: "Your data export will be available shortly." });
    // This can be a call to a dedicated export API endpoint
    await new Promise(res => setTimeout(res, 1200));
    setLoadingAction(null);
  };

  // --- CALENDAR HANDLERS ---
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
      const savedEventData = await apiRequest(url, { method, body: JSON.stringify(data) });
      const savedEvent = transformApiResponse(savedEventData, 'event');

      if (isEdit) {
        setAllEvents((prev) => prev.map((e) => (e.id === savedEvent.id ? savedEvent : e)));
      } else {
        setAllEvents((prev) => [...prev, savedEvent]);
      }
      toast({ title: isEdit ? "Event Updated" : "Event Created" });
      return true;
    } catch (error: any) {
      toast({ title: "Error Creating/Updating Event", description: error.message, variant: "destructive" });
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
      await apiRequest(`/api/admin/events/${event.id}`, { method: "DELETE" });
      toast({ title: "Event Deleted", description: `"${event.title}" has been removed.` });
    } catch (error: any) {
      toast({ title: "Error Deleting Event", description: error.message, variant: "destructive" });
      setAllEvents(originalEvents);
    } finally {
      setIsCalendarLoading(false);
    }
  };

  // --- MEMOIZED DERIVED STATE ---
  const isUserFormLoading = loadingAction === "add-user" || loadingAction?.startsWith("edit-");
  const isTeamFormLoading = loadingAction === "add-team" || loadingAction?.startsWith("edit-");
  const isDeptFormLoading = loadingAction === "add-department" || loadingAction?.startsWith("edit-");

  const entityForDialog = useMemo(() => {
    if (modal?.view !== "MANAGE_MEMBERS" || !modal.data) return null;
    const entity = modal.data.entityType === "team"
        ? teams.find((t) => t.id === modal.data!.id)
        : departments.find((d) => d.id === modal.data!.id);
    return entity ? { ...entity, entityType: modal.data.entityType } : null;
  }, [modal, teams, departments]);

  const userForEdit = useMemo(() => (modal?.view === "EDIT_USER" ? users.find((u) => u.id === modal.data!.id) : null), [modal, users]);
  const teamForEdit = useMemo(() => (modal?.view === "EDIT_TEAM" ? teams.find((t) => t.id === modal.data!.id) : null), [modal, teams]);
  const departmentForEdit = useMemo(() => (modal?.view === "EDIT_DEPARTMENT" ? departments.find((d) => d.id === modal.data!.id) : null), [modal, departments]);

  const filteredEvents = useMemo(() => {
    if (calendarFilterType === "all") return allEvents;
    return allEvents.filter((event) => event.type === calendarFilterType);
  }, [allEvents, calendarFilterType]);

  // --- UTILITIES ---
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

  const pageActions = { handleRefreshData, handleExportData, loadingAction };
  const modalData = {
    modal,
    setModal,
    closeModal,
    handleActionConfirm,
    entityForDialog,
    userForEdit,
    teamForEdit,
    departmentForEdit,
  };

  const userData = {
    users,
    handleSaveUser,
    isUserFormLoading,
  };
  const teamData = {
    teams,
    handleSaveTeam,
    isTeamFormLoading,
  };
  const departmentData = {
    departments,
    handleSaveDepartment,
    isDeptFormLoading,
  };
  const memberData = {
    handleAddMember,
    handleRemoveMember,
    handleChangeMemberRole,
  };
  const eventRequestData = { pendingEvents, handleAcceptEvent, handleRejectEvent };

  const calendarData = {
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

  return {
    pageActions,
    modalData,
    userData,
    teamData,
    departmentData,
    memberData,
    eventRequestData,
    calendarData,
    allUsers: users, // For member management dialog
    allDepartments: departments, // for team form
  };
};