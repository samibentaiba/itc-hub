// /admin/hook.ts
"use client";

// Removed client-api imports and will use direct fetch calls

import { useState, useMemo } from "react";
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
/**
 * A custom hook to manage all state and logic for the Admin Page.
 * This includes data state, loading states, and all action handlers.
 * @param initialUsers - Server-fetched initial users.
 * @param initialTeams - Server-fetched initial teams.
 * @param initialDepartments - Server-fetched initial departments.
 * @param initialEvents - Server-fetched initial events.
 * @param initialUpcomingEvents - Server-fetched initial upcoming events.
 * @param initialPendingEvents - Server-fetched initial pending events.
 */
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
  const [departments, setDepartments] =
    useState<Department[]>(initialDepartments);
  const [loadingAction, setLoadingAction] = useState<LoadingAction>(null);

  // --- Modal State ---
  const [modal, setModal] = useState<ModalState | null>(null);

  // --- State for Event Requests ---
  const [pendingEvents, setPendingEvents] =
    useState<PendingEvent[]>(initialPendingEvents);

  // --- State for Calendar ---
  const [allEvents, setAllEvents] = useState<Event[]>(initialEvents);
  const [upcomingEvents] = useState<UpcomingEvent[]>(
    initialUpcomingEvents
  );
  const [currentDate, setCurrentDate] = useState(new Date("2025-08-01"));
  const [calendarView, setCalendarView] = useState<"month" | "week" | "day">(
    "month"
  );
  const [showNewEventDialog, setShowNewEventDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isCalendarLoading, setIsCalendarLoading] = useState(false);
  const [calendarFilterType, setCalendarFilterType] = useState<string>("all");

  // --- SIMULATED API DELAY ---
  const simulateApi = (duration = 1000) =>
    new Promise((res) => setTimeout(res, duration));

  // --- Modal and Action Handlers ---
  const closeModal = () => setModal(null);

  const handleActionConfirm = () => {
    if (!modal || !modal.data) return;

    switch (modal.view) {
      case "DELETE_USER":
        handleDeleteUser(modal.data.id).then(closeModal);
        break;
      case "VERIFY_USER":
        handleVerifyUser(modal.data.id).then(closeModal);
        break;
      case "DELETE_TEAM":
        handleDeleteTeam(modal.data.id).then(closeModal);
        break;
      case "DELETE_DEPARTMENT":
        handleDeleteDepartment(modal.data.id).then(closeModal);
        break;
    }
  };

  // --- EVENT REQUEST HANDLERS ---
  const handleAcceptEvent = async (eventToAccept: PendingEvent) => {
    setLoadingAction(`accept-${eventToAccept.id}`);
    try {
      await simulateApi(700);

      const localDate = new Date(`${eventToAccept.date}T00:00:00`);

      const acceptedEvent: Event = {
        ...eventToAccept,
        date: formatDateString(localDate),
      };

      setAllEvents((prev) => [...prev, acceptedEvent]);
      setPendingEvents((prev) => prev.filter((e) => e.id !== eventToAccept.id));

      toast({
        title: "Event Approved",
        description: `"${eventToAccept.title}" has been added to the calendar.`,
      });
    } catch {
      toast({
        title: "Error",
        description: "Could not approve the event.",
        variant: "destructive",
      });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleRejectEvent = async (eventToReject: PendingEvent) => {
    setLoadingAction(`reject-${eventToReject.id}`);
    try {
      await simulateApi(700);
      setPendingEvents((prev) => prev.filter((e) => e.id !== eventToReject.id));
      toast({
        title: "Event Rejected",
        description: `"${eventToReject.title}" has been rejected.`,
        variant: "destructive",
      });
    } catch {
      toast({
        title: "Error",
        description: "Could not reject the event.",
        variant: "destructive",
      });
    } finally {
      setLoadingAction(null);
    }
  };

  // --- Memoized Derived State ---
  const isUserFormLoading =
    (modal?.view === "ADD_USER" && loadingAction === "add-user") ||
    (modal?.view === "EDIT_USER" && loadingAction === `edit-${modal.data?.id}`);

  const isTeamFormLoading =
    (modal?.view === "ADD_TEAM" && loadingAction === "add-team") ||
    (modal?.view === "EDIT_TEAM" && loadingAction === `edit-${modal.data?.id}`);

  const isDeptFormLoading =
    (modal?.view === "ADD_DEPARTMENT" && loadingAction === "add-department") ||
    (modal?.view === "EDIT_DEPARTMENT" &&
      loadingAction === `edit-${modal.data?.id}`);

  const entityForDialog = useMemo(() => {
    if (modal?.view !== "MANAGE_MEMBERS" || !modal.data) return null;

    const entity =
      modal.data.entityType === "team"
        ? teams.find((t) => t.id === modal.data!.id)
        : departments.find((d) => d.id === modal.data!.id);

    return entity ? { ...entity, entityType: modal.data.entityType } : null;
  }, [modal, teams, departments]);

  // Computed values for edit forms
  const userForEdit = useMemo(() => {
    if (modal?.view !== "EDIT_USER" || !modal.data?.id) return null;
    return users.find((u) => u.id === modal.data!.id) || null;
  }, [modal, users]);

  const teamForEdit = useMemo(() => {
    if (modal?.view !== "EDIT_TEAM" || !modal.data?.id) return null;
    return teams.find((t) => t.id === modal.data!.id) || null;
  }, [modal, teams]);

  const departmentForEdit = useMemo(() => {
    if (modal?.view !== "EDIT_DEPARTMENT" || !modal.data?.id) return null;
    return departments.find((d) => d.id === modal.data!.id) || null;
  }, [modal, departments]);

  // --- USER HANDLERS ---
  const handleSaveUser = async (data: UserFormData & { id?: string }) => {
    const actionId = data.id ? `edit-${data.id}` : "add-user";
    setLoadingAction(actionId);
    try {
      await simulateApi();
      if (data.id) {
        setUsers((prev) =>
          prev.map((u) => (u.id === data.id ? { ...u, ...data } : u))
        );
        toast({
          title: "User Updated",
          description: `${data.name}'s details have been saved.`,
        });
      } else {
        const newUser: User = {
          id: `u${Date.now()}`,
          ...data,
          status: "pending",
          joinedDate: new Date().toISOString().split("T")[0],
          avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
          role: "user",
        };
        setUsers((prev) => [...prev, newUser]);
        toast({
          title: "User Added",
          description: `${data.name} can now be managed.`,
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Could not save user details.",
        variant: "destructive",
      });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    setLoadingAction(`delete-${userId}`);
    const originalUsers = users;
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    try {
      await simulateApi();
      toast({ title: "User Deleted" });
    } catch {
      toast({ title: "Error Deleting User", variant: "destructive" });
      setUsers(originalUsers);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleVerifyUser = async (userId: string) => {
    setLoadingAction(`verify-${userId}`);
    try {
      await simulateApi(500);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status: "verified" } : u))
      );
      toast({ title: "User Verified" });
    } catch {
      toast({ title: "Error Verifying User", variant: "destructive" });
    } finally {
      setLoadingAction(null);
    }
  };

  // --- TEAM HANDLERS ---
  const handleSaveTeam = async (data: TeamFormData & { id?: string }) => {
    const actionId = data.id ? `edit-${data.id}` : "add-team";
    setLoadingAction(actionId);
    try {
      await simulateApi();
      if (data.id) {
        setTeams((prev) =>
          prev.map((t) => (t.id === data.id ? { ...t, ...data } : t))
        );
        toast({ title: "Team Updated" });
      } else {
        const newTeam: Team = {
          id: `t${Date.now()}`,
          ...data,
          description: data.description || "",
          members: [],
          createdDate: new Date().toISOString().split("T")[0],
          status: "active",
        };
        setTeams((prev) => [...prev, newTeam]);
        toast({ title: "Team Created" });
      }
    } catch {
      toast({ title: "Error Saving Team", variant: "destructive" });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDeleteTeam = async (teamId: string) => {
    setLoadingAction(`delete-${teamId}`);
    const originalTeams = teams;
    setTeams((prev) => prev.filter((t) => t.id !== teamId));
    try {
      await simulateApi();
      toast({ title: "Team Deleted" });
    } catch {
      toast({ title: "Error Deleting Team", variant: "destructive" });
      setTeams(originalTeams);
    } finally {
      setLoadingAction(null);
    }
  };

  // --- DEPARTMENT HANDLERS ---
  const handleSaveDepartment = async (
    data: DepartmentFormData & { id?: string }
  ) => {
    const actionId = data.id ? `edit-${data.id}` : "add-department";
    setLoadingAction(actionId);
    try {
      await simulateApi();
      if (data.id) {
        setDepartments((prev) =>
          prev.map((d) => (d.id === data.id ? { ...d, ...data } : d))
        );
        toast({ title: "Department Updated" });
      } else {
        const newDept: Department = {
          id: `d${Date.now()}`,
          name: data.name,
          description: data.description || "",
          members: [],
          teams: [],
          createdDate: new Date().toISOString().split("T")[0],
          status: "active",
          manager: undefined,
          memberCount: 0,
          ticketCount: 0,
        };
        setDepartments((prev) => [...prev, newDept]);
        toast({ title: "Department Created" });
      }
    } catch {
      toast({ title: "Error Saving Department", variant: "destructive" });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDeleteDepartment = async (deptId: string) => {
    setLoadingAction(`delete-${deptId}`);
    const originalDepts = departments;
    setDepartments((prev) => prev.filter((d) => d.id !== deptId));
    try {
      await simulateApi();
      setTeams((prev) => prev.filter((t) => t.departmentId !== deptId));
      toast({ title: "Department Deleted" });
    } catch {
      toast({ title: "Error Deleting Department", variant: "destructive" });
      setDepartments(originalDepts);
    } finally {
      setLoadingAction(null);
    }
  };

  // --- MEMBER MANAGEMENT ---
  const updateEntityMembers = (
    entityId: string,
    entityType: "team" | "department",
    updateFn: (members: Member[]) => Member[]
  ) => {
    if (entityType === "team") {
      setTeams((prev) =>
        prev.map((entity) =>
          entity.id === entityId
            ? { ...entity, members: updateFn(entity.members) }
            : entity
        )
      );
    } else {
      setDepartments((prev) =>
        prev.map((entity) =>
          entity.id === entityId
            ? { ...entity, members: updateFn(entity.members) }
            : entity
        )
      );
    }
  };

  const handleAddMember = (
    entityId: string,
    entityType: "team" | "department",
    userId: string,
    role: Member["role"]
  ) => {
    updateEntityMembers(entityId, entityType, (members) => [
      ...members,
      { userId, role },
    ]);
    toast({ title: "Member Added" });
  };

  const handleRemoveMember = (
    entityId: string,
    entityType: "team" | "department",
    userId: string
  ) => {
    updateEntityMembers(entityId, entityType, (members) =>
      members.filter((m) => m.userId !== userId)
    );
    toast({ title: "Member Removed" });
  };

  const handleChangeMemberRole = (
    entityId: string,
    entityType: "team" | "department",
    userId: string,
    newRole: Member["role"]
  ) => {
    updateEntityMembers(entityId, entityType, (members) =>
      members.map((m) => (m.userId === userId ? { ...m, role: newRole } : m))
    );
    toast({ title: "Member Role Updated" });
  };

  const handleRefreshData = async () => {
    setLoadingAction("refresh");
    try {
      await simulateApi(1500);
      toast({
        title: "Data Refreshed",
        description: "Latest data has been loaded.",
      });
    } catch {
      toast({
        title: "Error",
        description: "Could not refresh data.",
        variant: "destructive",
      });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleExportData = async () => {
    setLoadingAction("export");
    await simulateApi(1200);
    toast({
      title: "Export Started",
      description: "Your data export will be available shortly.",
    });
    setLoadingAction(null);
  };

  // --- Handlers for Calendar ---
  const navigateCalendar = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (calendarView === "month")
        newDate.setMonth(
          direction === "prev" ? prev.getMonth() - 1 : prev.getMonth() + 1
        );
      if (calendarView === "week")
        newDate.setDate(prev.getDate() + (direction === "prev" ? -7 : 7));
      if (calendarView === "day")
        newDate.setDate(prev.getDate() + (direction === "prev" ? -1 : 1));
      return newDate;
    });
  };

  const handleDayClick = (date: Date) => {
    setCurrentDate(date);
    setCalendarView("day");
  };

  const createEvent = async (
    data: EventFormData & { id?: string }
  ): Promise<boolean> => {
    setIsCalendarLoading(true);
    try {
      if (data.id) {
        // Update event
        const response = await fetch(`/api/events/${data.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error('Failed to update event');
        }

        const updatedEvent = await response.json();
        setAllEvents((prev) =>
          prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e))
        );
        toast({ title: "Event updated successfully" });
      } else {
        // Create new event
        const response = await fetch('/api/events', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error('Failed to create event');
        }

        const newEvent = await response.json();
        setAllEvents((prev) => [...prev, newEvent]);
        toast({ title: "Event created successfully" });
      }
      return true; // Return true on success
    } catch {
      toast({ title: "Error Creating/Updating Event", variant: "destructive" });
      return false; // Return false on error
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
    try {
      await simulateApi();
      setAllEvents((prev) => prev.filter((e) => e.id !== event.id));
      toast({
        title: "Event Deleted",
        description: `"${event.title}" has been removed.`,
      });
      setSelectedEvent(null);
    } catch {
      toast({ title: "Error Deleting Event", variant: "destructive" });
    } finally {
      setIsCalendarLoading(false);
    }
  };

  const filteredEvents = useMemo(() => {
    if (calendarFilterType === "all") return allEvents;
    return allEvents.filter((event) => event.type === calendarFilterType);
  }, [allEvents, calendarFilterType]);

  return {
    users,
    teams,
    departments,
    loadingAction,
    handleSaveUser,
    handleDeleteUser,
    handleVerifyUser,
    handleSaveTeam,
    handleDeleteTeam,
    handleSaveDepartment,
    handleDeleteDepartment,
    handleAddMember,
    handleRemoveMember,
    handleChangeMemberRole,
    handleRefreshData,
    handleExportData,
    pendingEvents,
    handleAcceptEvent,
    handleRejectEvent,
    // Modal State & Handlers
    modal,
    setModal,
    closeModal,
    handleActionConfirm,
    entityForDialog,
    userForEdit,
    teamForEdit,
    departmentForEdit,
    isUserFormLoading,
    isTeamFormLoading,
    isDeptFormLoading,
    // Calendar State
    calendarView,
    currentDate,
    filteredEvents,
    upcomingEvents,
    showNewEventDialog,
    selectedEvent,
    isCalendarLoading,
    calendarFilterType,
    // Calendar Handlers
    setCalendarView,
    navigateCalendar,
    createEvent,
    setSelectedEvent,
    setShowNewEventDialog,
    setCalendarFilterType,
    handleDayClick,
    handleEditEvent,
    handleDeleteEvent,
    // Utilities
    formatCalendarDate: (date: Date) => formatDate(date, calendarView),
    getDaysInMonth,
    getFirstDayOfMonth,
    formatDateString,
  };
};



// /calendar/utils.ts

/**
 * Formats a date object into a string based on the current calendar view.
 * @param date - The date to format.
 * @param view - The current calendar view ('day', 'week', or 'month').
 * @returns A formatted date string.
 */
const formatDate = (date: Date, view: "month" | "week" | "day"): string => {
  if (view === 'day') {
    return date.toLocaleDateString("en-US", {
      weekday: 'long',
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }
  if (view === 'week') {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return `${startOfWeek.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${endOfWeek.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
  }
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
};

/**
 * Gets the number of days in a given month.
 * @param date - A date within the desired month.
 * @returns The total number of days in that month.
 */
const getDaysInMonth = (date: Date): number => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

/**
 * Gets the day of the week for the first day of a given month.
 * (0 for Sunday, 1 for Monday, etc.)
 * @param date - A date within the desired month.
 * @returns The day of the week (0-6).
 */
const getFirstDayOfMonth = (date: Date): number => {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
};

/**
 * Formats a date object into a "YYYY-MM-DD" string, respecting the local timezone.
 * This prevents the date from shifting unexpectedly due to UTC conversion.
 * @param date - The date to format.
 * @returns The formatted date string.
 */
const formatDateString = (date: Date): string => {
  const year = date.getFullYear();
  // getMonth() is zero-based, so we add 1
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};
