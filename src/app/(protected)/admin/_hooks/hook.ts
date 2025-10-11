
// /app/(protected)/admin/_hooks/hook.ts
"use client";

import { useState, useMemo, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useEntityManagement } from "./useEntityManagement";
import { useCalendarAndEvents } from "./useCalendarAndEvents";
import { apiRequest } from "./useApiHelper";
import type { User, Team, Department, Member, ModalState, Event, UpcomingEvent, PendingEvent } from "../types";

export const useAdminPage = (
  initialUsers: User[],
  initialTeams: Team[],
  initialDepartments: Department[],
  initialEvents: Event[],
  initialUpcomingEvents: UpcomingEvent[],
  initialPendingEvents: PendingEvent[]
) => {
  const { toast } = useToast();
  const [pageLoadingAction, setPageLoadingAction] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState | null>(null);

  const entityData = useEntityManagement(initialUsers, initialTeams, initialDepartments);
  const eventData = useCalendarAndEvents(initialEvents, initialPendingEvents);

  const closeModal = () => setModal(null);

  // --- MEMBER MANAGEMENT ---
  const handleMemberAction = async (
    action: 'add' | 'remove' | 'update',
    entityId: string, 
    entityType: "team" | "department", 
    userId: string, 
    role?: Member["role"]
  ) => {
    const url = `/api/admin/${entityType}s/${entityId}/members` + (action === 'remove' ? `/${userId}` : '');
    const method = action === 'add' ? 'POST' : action === 'update' ? 'PUT' : 'DELETE';
    const body = action !== 'remove' ? JSON.stringify({ userId, role: role?.toUpperCase() }) : undefined;
    
    try {
      await apiRequest(url, { method, body });
      await handleRefreshData(); // Refresh all data to ensure consistency
      toast({ title: `Member ${action === 'add' ? 'Added' : action === 'update' ? 'Updated' : 'Removed'}` });
    } catch (error: unknown) {
      toast({ title: `Error ${action}ing Member`, description: (error as Error).message, variant: "destructive" });
    }
  };

  // --- DATA REFRESH ---
  const handleRefreshData = useCallback(async () => {
    setPageLoadingAction("refresh");
    try {
      const [usersData, teamsData, deptsData, eventsData, pendingEventsData] = await Promise.all([
        apiRequest('/api/admin/users'),
        apiRequest('/api/admin/teams'),
        apiRequest('/api/admin/departments'),
        apiRequest('/api/admin/events'),
        apiRequest('/api/admin/events/requests'),
      ]);

      entityData.setUsers(usersData.users.map((u: User) => entityData.transformApiResponse(u, 'user')));
      entityData.setTeams(teamsData.teams.map((t: Team) => entityData.transformApiResponse(t, 'team')));
      entityData.setDepartments(deptsData.departments.map((d: Department) => entityData.transformApiResponse(d, 'department')));
      eventData.setAllEvents(eventsData.events.map((e: Event) => eventData.transformEvent(e)));
      eventData.setPendingEvents(pendingEventsData.events.map((e: PendingEvent) => eventData.transformEvent(e)));

      toast({ title: "Data Refreshed" });
    } catch (error: unknown) {
      toast({ title: "Error Refreshing Data", description: (error as Error).message, variant: "destructive" });
    } finally {
      setPageLoadingAction(null);
    }
  }, [toast, entityData, eventData]);

  // --- MODAL AND ACTION CONFIRMATION ---
  const handleActionConfirm = () => {
    if (!modal || !modal.data) return;
    const { view, data } = modal;

    const actions: Record<string, (id: string) => Promise<unknown>> = {
      DELETE_USER: entityData.handleDeleteUser,
      VERIFY_USER: entityData.handleVerifyUser,
      DELETE_TEAM: entityData.handleDeleteTeam,
      DELETE_DEPARTMENT: entityData.handleDeleteDepartment,
    };

    if (actions[view]) {
      actions[view](data.id).finally(closeModal);
    }
  };

  // --- DERIVED STATE FOR MODALS ---
  const userForEdit = useMemo(() => (modal?.view === "EDIT_USER" ? entityData.users.find((u) => u.id === modal.data!.id) : null), [modal, entityData.users]);
  const teamForEdit = useMemo(() => (modal?.view === "EDIT_TEAM" ? entityData.teams.find((t) => t.id === modal.data!.id) : null), [modal, entityData.teams]);
  const departmentForEdit = useMemo(() => (modal?.view === "EDIT_DEPARTMENT" ? entityData.departments.find((d) => d.id === modal.data!.id) : null), [modal, entityData.departments]);
  const entityForDialog = useMemo(() => {
    if (modal?.view !== "MANAGE_MEMBERS" || !modal.data) return null;
    const entity = modal.data.entityType === "team"
        ? entityData.teams.find((t) => t.id === modal.data!.id)
        : entityData.departments.find((d) => d.id === modal.data!.id);
    return entity ? { ...entity, entityType: modal.data.entityType } : null;
  }, [modal, entityData.teams, entityData.departments]);


  return {
    // Page-level actions and state
    pageActions: {
      handleRefreshData,
      handleExportData: () => toast({ title: "Export starting..." }), // Placeholder
      loadingAction: pageLoadingAction || entityData.loadingAction || eventData.loadingAction,
    },
    // Modal management
    modalData: {
      modal, setModal, closeModal, handleActionConfirm,
      userForEdit, teamForEdit, departmentForEdit, entityForDialog,
    },
    // Data and actions from sub-hooks
    userData: {
      users: entityData.users,
      handleSaveUser: entityData.handleSaveUser,
      isUserFormLoading: entityData.isUserFormLoading,
    },
    teamData: {
      teams: entityData.teams,
      handleSaveTeam: entityData.handleSaveTeam,
      isTeamFormLoading: entityData.isTeamFormLoading,
    },
    departmentData: {
      departments: entityData.departments,
      handleSaveDepartment: entityData.handleSaveDepartment,
      isDeptFormLoading: entityData.isDeptFormLoading,
    },
    memberData: {
      handleAddMember: (entityId: string, entityType: "team" | "department", userId: string, role: Member["role"]) => handleMemberAction('add', entityId, entityType, userId, role),
      handleRemoveMember: (entityId: string, entityType: "team" | "department", userId: string) => handleMemberAction('remove', entityId, entityType, userId),
      handleChangeMemberRole: (entityId: string, entityType: "team" | "department", userId: string, newRole: Member["role"]) => handleMemberAction('update', entityId, entityType, userId, newRole),
    },
    eventRequestData: eventData.eventRequestData,
    calendarData: eventData.calendarData,
    // Pass down for forms/dialogs that need full lists
    allUsers: entityData.users,
    allDepartments: entityData.departments,
  };
};
