// /admin/client.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Shield, Download, RefreshCw } from "lucide-react";

// Import hook and types
import { useAdminPage } from "./hook";
import type {
  User,
  Team,
  Department,
  Event,
  UpcomingEvent,
  PendingEvent,
} from "./types";

// Import consolidated and new components
import AdminTabs from "./_components/admin-tabs";
import StatsCards from "./_components/stats-cards";
import UserFormDialog from "./_components/user-form-dialog";
import TeamFormDialog from "./_components/team-form-dialog";
import DepartmentFormDialog from "./_components/department-form-dialog";
import ActionConfirmationDialog from "./_components/shared/action-confirmation-dialog";
import ManageMembersDialog from "./_components/shared/manage-members-dialog";
import CreateEventDialog from "./_components/create-event-dialog";
import EventDetailsDialog from "./_components/event-details-dialog";

interface AdminClientPageProps {
  initialUsers: User[];
  initialTeams: Team[];
  initialDepartments: Department[];
  initialEvents: Event[];
  initialUpcomingEvents: UpcomingEvent[];
  initialPendingEvents: PendingEvent[];
}

export default function AdminClientPage({
  initialUsers,
  initialTeams,
  initialDepartments,
  initialEvents,
  initialUpcomingEvents,
  initialPendingEvents,
}: AdminClientPageProps) {
  const {
    users,
    teams,
    departments,
    loadingAction,
    handleSaveUser,
    handleSaveTeam,
    handleSaveDepartment,
    handleAddMember,
    handleRemoveMember,
    handleChangeMemberRole,
    handleRefreshData,
    handleExportData,
    pendingEvents,
    handleAcceptEvent,
    handleRejectEvent,
    // Modal State & Handlers from hook
    modal,
    setModal,
    closeModal,
    handleActionConfirm,
    entityForDialog,
    isUserFormLoading,
    isTeamFormLoading,
    isDeptFormLoading,
    // Calendar State & Props from hook
    calendarView,
    currentDate,
    filteredEvents,
    upcomingEvents,
    showNewEventDialog,
    selectedEvent,
    isCalendarLoading,
    calendarFilterType,
    // Handlers for Calendar from hook
    setCalendarView,
    navigateCalendar,
    createEvent,
    setSelectedEvent,
    setShowNewEventDialog,
    setCalendarFilterType,
    handleDayClick,
    handleEditEvent,
    handleDeleteEvent,
    // Calendar Utilities from hook
    formatCalendarDate,
    getDaysInMonth,
    getFirstDayOfMonth,
    formatDateString,
  } = useAdminPage(
    initialUsers,
    initialTeams,
    initialDepartments,
    initialEvents,
    initialUpcomingEvents,
    initialPendingEvents
  );

  return (
    <>
      <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-red-500" />
              Admin Panel
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage users, teams, and departments
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshData}
              disabled={loadingAction === "refresh"}
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${
                  loadingAction === "refresh" ? "animate-spin" : ""
                }`}
              />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportData}
              disabled={loadingAction === "export"}
            >
              <Download
                className={`mr-2 h-4 w-4 ${
                  loadingAction === "export" ? "animate-spin" : ""
                }`}
              />
              Export
            </Button>
          </div>
        </div>

        <StatsCards users={users} teams={teams} departments={departments} />

        <AdminTabs
          users={users}
          teams={teams}
          departments={departments}
          onSetModal={setModal}
          // Event Props
          pendingEvents={pendingEvents}
          handleAcceptEvent={handleAcceptEvent}
          handleRejectEvent={handleRejectEvent}
          loadingAction={loadingAction}
          // Calendar Props
          calendarView={calendarView}
          currentDate={currentDate}
          events={filteredEvents}
          upcomingEvents={upcomingEvents}
          onSetCalendarView={setCalendarView}
          onNavigateCalendar={navigateCalendar}
          onSetSelectedEvent={setSelectedEvent}
          onNewEventClick={() => setShowNewEventDialog(true)}
          onFilterChange={setCalendarFilterType}
          filterType={calendarFilterType}
          onDayClick={handleDayClick}
          formatDate={formatCalendarDate}
          getDaysInMonth={getDaysInMonth}
          getFirstDayOfMonth={getFirstDayOfMonth}
          formatDateString={formatDateString}
        />
      </div>

      {/* --- DIALOGS --- */}
      <UserFormDialog
        isOpen={modal?.view === "ADD_USER" || modal?.view === "EDIT_USER"}
        onClose={closeModal}
        onSubmit={(data) => handleSaveUser(data).then(closeModal)}
        isLoading={isUserFormLoading}
        initialData={modal?.view === "EDIT_USER" ? modal.data : undefined}
      />

      <TeamFormDialog
        isOpen={modal?.view === "ADD_TEAM" || modal?.view === "EDIT_TEAM"}
        onClose={closeModal}
        onSubmit={(data) => handleSaveTeam(data).then(closeModal)}
        isLoading={isTeamFormLoading}
        initialData={modal?.view === "EDIT_TEAM" ? modal.data : undefined}
        departments={departments}
      />

      <DepartmentFormDialog
        isOpen={
          modal?.view === "ADD_DEPARTMENT" || modal?.view === "EDIT_DEPARTMENT"
        }
        onClose={closeModal}
        onSubmit={(data) => handleSaveDepartment(data).then(closeModal)}
        isLoading={isDeptFormLoading}
        initialData={modal?.view === "EDIT_DEPARTMENT" ? modal.data : undefined}
      />

      <ManageMembersDialog
        isOpen={modal?.view === "MANAGE_MEMBERS"}
        onClose={closeModal}
        entity={entityForDialog as (Team & { entityType: 'team' }) | (Department & { entityType: 'department' }) | null}
        allUsers={users}
        onAddMember={handleAddMember}
        onRemoveMember={handleRemoveMember}
        onChangeMemberRole={handleChangeMemberRole}
      />

      <ActionConfirmationDialog
        isOpen={[
          "DELETE_USER",
          "VERIFY_USER",
          "DELETE_TEAM",
          "DELETE_DEPARTMENT",
        ].includes(modal?.view || "")}
        onClose={closeModal}
        onConfirm={handleActionConfirm}
        isLoading={!!loadingAction}
        title={
          modal?.view === "VERIFY_USER"
            ? "Confirm Verification"
            : "Are you absolutely sure?"
        }
        description={
          modal?.view === "DELETE_USER"
            ? `This will permanently delete ${modal.data.name}.`
            : modal?.view === "VERIFY_USER"
            ? `This will mark ${modal.data.name} as verified.`
            : modal?.view === "DELETE_TEAM"
            ? `This will permanently delete the ${modal.data.name} team.`
            : modal?.view === "DELETE_DEPARTMENT"
            ? `This will permanently delete the ${modal.data.name} department and all its teams.`
            : "This action cannot be undone."
        }
      />
      
      {/* Calendar Dialogs */}
      <CreateEventDialog
        isOpen={showNewEventDialog}
        onClose={() => {
          setSelectedEvent(null)
          setShowNewEventDialog(false)
        }}
            onSubmit={async (data) => {
          const success = await createEvent(data);
          if (success) {
            setSelectedEvent(null);
            setShowNewEventDialog(false);
          }
          return success; // Make sure to return the result
        }}
        isLoading={isCalendarLoading}
        initialData={selectedEvent || undefined}
      />

      <EventDetailsDialog
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
      />
    </>
  );
}