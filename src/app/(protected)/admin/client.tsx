"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Download } from "lucide-react";

// Import hooks
import { useAdminPage } from "./_hooks/useAdminPage";
import type {
  User,
  Team,
  Department,
  Event,
  UpcomingEvent,
  PendingEvent,
} from "./types";

// Import components
import { StatsCards } from "./_components/StatsCards";
import { AdminTabs } from "./_components/AdminTabs";
import { UserFormDialog } from "./_components/UserFormDialog";
import { TeamFormDialog } from "./_components/TeamFormDialog";
import { DepartmentFormDialog } from "./_components/DepartmentFormDialog";
import { ActionConfirmationDialog } from "./_components/ActionConfirmationDialog";
import { ManageMembersDialog } from "./_components/ManageMembersDialog";
import { CreateEventDialog } from "./_components/CreateEventDialog";
import { EventDetailsDialog } from "./_components/EventDetailsDialog";
import { ManagingEntity } from "./types";


/**
 * @interface AdminClientPageProps
 * @description Defines the props for the AdminClientPage component.
 * @property {User[]} initialUsers - The initial list of users.
 * @property {Team[]} initialTeams - The initial list of teams.
 * @property {Department[]} initialDepartments - The initial list of departments.
 * @property {Event[]} initialEvents - The initial list of events.
 * @property {UpcomingEvent[]} initialUpcomingEvents - The initial list of upcoming events.
 * @property {PendingEvent[]} initialPendingEvents - The initial list of pending events.
 */
interface AdminClientPageProps {
  initialUsers: User[];
  initialTeams: Team[];
  initialDepartments: Department[];
  initialEvents: Event[];
  initialUpcomingEvents: UpcomingEvent[];
  initialPendingEvents: PendingEvent[];
}

/**
 * @component AdminClientPage
 * @description This is the main client component for the admin dashboard. It initializes the main `useAdminPage` hook, manages the display of dialogs, and renders the page layout.
 * @param {AdminClientPageProps} props - The initial data for the page.
 * @returns {JSX.Element} - The rendered admin dashboard page.
 */
export default function AdminClientPage({
  initialUsers,
  initialTeams,
  initialDepartments,
  initialEvents,
  initialUpcomingEvents,
  initialPendingEvents,
}: AdminClientPageProps) {
  const {
    pageActions,
    modalData,
    userData,
    teamData,
    departmentData,
    memberData,
    eventRequestData,
    calendarData,
    allUsers,
    allDepartments,
  } = useAdminPage(
    initialUsers,
    initialTeams,
    initialDepartments,
    initialEvents,
    initialUpcomingEvents,
    initialPendingEvents
  );

  const dialogs = useMemo(() => (
    <>
      <UserFormDialog
        isOpen={modalData.modal?.view === "ADD_USER" || modalData.modal?.view === "EDIT_USER"}
        onClose={modalData.closeModal}
        onSubmit={userData.handleSaveUser}
        isLoading={!!userData.isUserFormLoading}
        initialData={modalData.userForEdit}
      />
      <TeamFormDialog
        isOpen={modalData.modal?.view === "ADD_TEAM" || modalData.modal?.view === "EDIT_TEAM"}
        onClose={modalData.closeModal}
        onSubmit={teamData.handleSaveTeam}
        isLoading={!!teamData.isTeamFormLoading}
        initialData={modalData.teamForEdit}
        departments={allDepartments}
      />
      <DepartmentFormDialog
        isOpen={modalData.modal?.view === "ADD_DEPARTMENT" || modalData.modal?.view === "EDIT_DEPARTMENT"}
        onClose={modalData.closeModal}
        onSubmit={departmentData.handleSaveDepartment}
        isLoading={!!departmentData.isDeptFormLoading}
        initialData={modalData.departmentForEdit}
      />
      <ActionConfirmationDialog
        isOpen={["DELETE_USER", "VERIFY_USER", "DELETE_TEAM", "DELETE_DEPARTMENT"].includes(modalData.modal?.view || "")}
        onClose={modalData.closeModal}
        onConfirm={modalData.handleActionConfirm}
        isLoading={!!pageActions.loadingAction}
        title={modalData.modal?.view.includes("DELETE") ? "Are you sure?" : "Confirm Action"}
        description={
          modalData.modal?.view === "DELETE_USER" ? "This will permanently delete the user."
          : modalData.modal?.view === "VERIFY_USER" ? "This will mark the user as verified."
          : modalData.modal?.view === "DELETE_TEAM" ? "This will permanently delete the team."
          : modalData.modal?.view === "DELETE_DEPARTMENT" ? "This will permanently delete the department and its teams."
          : ""
        }
      />
      <ManageMembersDialog
        isOpen={modalData.modal?.view === "MANAGE_MEMBERS"}
        onClose={modalData.closeModal}
        entity={modalData.entityForDialog as ManagingEntity}
        allUsers={allUsers}
        memberActions={{ add: memberData.handleAddMember, remove: memberData.handleRemoveMember, updateRole: memberData.handleChangeMemberRole }}
      />
      <CreateEventDialog
        isOpen={calendarData.showNewEventDialog}
        onClose={() => {
          calendarData.actions.setShowNewEventDialog(false);
          calendarData.actions.setSelectedEvent(null);
        }}
        onSubmit={calendarData.actions.createEvent}
        isLoading={calendarData.isLoading}
        initialData={calendarData.selectedEvent}
      />
      <EventDetailsDialog
        event={calendarData.selectedEvent}
        onClose={() => calendarData.actions.setSelectedEvent(null)}
        onEdit={calendarData.actions.handleEditEvent}
        onDelete={calendarData.actions.handleDeleteEvent}
      />
    </>
  ), [modalData, userData, teamData, departmentData, pageActions, memberData, calendarData, allUsers, allDepartments]);

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage all aspects of the ITC Hub.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={pageActions.handleRefreshData} disabled={pageActions.loadingAction === "refresh"}>
            <RefreshCw className={`h-4 w-4 ${pageActions.loadingAction === "refresh" ? "animate-spin" : ""}`} />
          </Button>
          <Button variant="outline" onClick={pageActions.handleExportData} disabled={pageActions.loadingAction === "export"}>
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      </header>

      <StatsCards users={userData.users} teams={teamData.teams} departments={departmentData.departments} />

      <AdminTabs
        userData={userData}
        teamData={teamData}
        departmentData={departmentData}
        eventRequestData={eventRequestData}
        calendarData={calendarData}
        onSetModal={modalData.setModal}
        loadingAction={pageActions.loadingAction}
      />

      {dialogs}
    </div>
  );
}