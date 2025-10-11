import { useState, useMemo, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useUsers } from "./_hooks/useUsers";
import { useTeams } from "./_hooks/useTeams";
import { useDepartments } from "./_hooks/useDepartments";
import { useEventRequests } from "./_hooks/useEventRequests";
import { useMembers } from "./_hooks/useMembers";
import { useCalendar } from "./_hooks/useCalendar";
import { apiRequest, transformApiResponse } from "./utils";
import type {
  User,
  Team,
  Department,
  Event,
  UpcomingEvent,
  PendingEvent,
  ModalState,
} from "./types";

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
  initialUpcomingEvents: UpcomingEvent[],
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
      calendarData.setAllEvents(eventsData.events.map((e: any) => transformApiResponse(e, 'event')));
      setPendingEvents(pendingEventsData.events.map((e: any) => transformApiResponse(e, 'event')));

      toast({ title: "Data Refreshed", description: "Latest data has been loaded." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Could not refresh data.", variant: "destructive" });
    } finally {
      setLoadingAction(null);
    }
  }, [toast, setUsers, setTeams, setDepartments, calendarData.setAllEvents, setPendingEvents]);

  const {
    handleAddMember,
    handleRemoveMember,
    handleChangeMemberRole,
  } = useMembers(handleRefreshData);

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

  const handleExportData = async () => {
    setLoadingAction("export");
    toast({ title: "Export Started", description: "Your data export will be available shortly." });
    await new Promise(res => setTimeout(res, 1200));
    setLoadingAction(null);
  };


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


  return {
    pageActions: {
      handleRefreshData,
      handleExportData,
      loadingAction: loadingAction || userLoadingAction || teamLoadingAction || departmentLoadingAction || eventRequestLoadingAction,
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
      isUserFormLoading: userLoadingAction === "add-user" || userLoadingAction?.startsWith("edit-"),
    },
    teamData: {
      teams,
      handleSaveTeam,
      isTeamFormLoading: teamLoadingAction === "add-team" || teamLoadingAction?.startsWith("edit-"),
    },
    departmentData: {
      departments,
      handleSaveDepartment,
      isDeptFormLoading: departmentLoadingAction === "add-department" || departmentLoadingAction?.startsWith("edit-"),
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