"use client";

import { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  UserPlus,
  Trash2,
  MoreVertical,
  Users2,
  Filter,
  Loader2,
  Calendar,
  Clock,
  MapPin,
  Users,
  Edit,
  Building2,
  Mail,
  CheckCircle,
} from "lucide-react";
import type {
  DepartmentFormData,
  TeamFormData,
  UserFormData,
  EventFormData,
  User,
  Team,
  Project,
  Vlog,
  PendingProject,
  PendingVlog,
  ProjectFormData,
  VlogFormData,
  Department,
  Event,
  PendingEvent,
  ModalState,
} from "./types";

import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatLeaders, getStatusBadgeVariant } from "./utils";
import { Button } from "@/components/ui/button";
import {
  RefreshCw,
  Download,
  ChevronLeft,
  ChevronRight,
  X,
  Plus,
  Check,
} from "lucide-react";
import { useAdminPage } from "./hook";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { FileText, Video, Eye } from "lucide-react";

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
  initialPendingEvents,
  initialProjects,
  initialVlogs,
  initialPendingProjects,
  initialPendingVlogs,
}: {
  initialUsers: User[];
  initialTeams: Team[];
  initialDepartments: Department[];
  initialEvents: Event[];
  initialPendingEvents: PendingEvent[];
  initialProjects: Project[];
  initialVlogs: Vlog[];
  initialPendingProjects: PendingProject[];
  initialPendingVlogs: PendingVlog[];
}) {
  const {
    pageActions,
    modalData,
    userData,
    teamData,
    departmentData,
    memberData,
    eventRequestData,
    calendarData,
    projectData,
    vlogData,
    contentRequestData,
    allUsers,
    allDepartments,
  } = useAdminPage(
    initialUsers,
    initialTeams,
    initialDepartments,
    initialEvents,
    initialPendingEvents,
    initialProjects,
    initialVlogs,
    initialPendingProjects,
    initialPendingVlogs
  );

  const dialogs = useMemo(
    () => (
      <>
        <UserFormDialog
          isOpen={
            modalData.modal?.view === "ADD_USER" ||
            modalData.modal?.view === "EDIT_USER"
          }
          onClose={modalData.closeModal}
          onSubmit={userData.handleSaveUser}
          isLoading={!!userData.isUserFormLoading}
          initialData={modalData.userForEdit}
        />
        <TeamFormDialog
          isOpen={
            modalData.modal?.view === "ADD_TEAM" ||
            modalData.modal?.view === "EDIT_TEAM"
          }
          onClose={modalData.closeModal}
          onSubmit={teamData.handleSaveTeam}
          isLoading={!!teamData.isTeamFormLoading}
          initialData={modalData.teamForEdit}
          departments={allDepartments}
        />
        <DepartmentFormDialog
          isOpen={
            modalData.modal?.view === "ADD_DEPARTMENT" ||
            modalData.modal?.view === "EDIT_DEPARTMENT"
          }
          onClose={modalData.closeModal}
          onSubmit={departmentData.handleSaveDepartment}
          isLoading={!!departmentData.isDeptFormLoading}
          initialData={modalData.departmentForEdit}
        />
        <ActionConfirmationDialog
          isOpen={[
            "DELETE_USER",
            "VERIFY_USER",
            "DELETE_TEAM",
            "DELETE_DEPARTMENT",
          ].includes(modalData.modal?.view || "")}
          onClose={modalData.closeModal}
          onConfirm={modalData.handleActionConfirm}
          isLoading={!!pageActions.loadingAction}
          title={
            modalData.modal?.view.includes("DELETE")
              ? "Are you sure?"
              : "Confirm Action"
          }
          description={
            modalData.modal?.view === "DELETE_USER"
              ? "This will permanently delete the user."
              : modalData.modal?.view === "VERIFY_USER"
              ? "This will mark the user as verified."
              : modalData.modal?.view === "DELETE_TEAM"
              ? "This will permanently delete the team."
              : modalData.modal?.view === "DELETE_DEPARTMENT"
              ? "This will permanently delete the department and its teams."
              : ""
          }
        />
        <ManageMembersDialog
          isOpen={modalData.modal?.view === "MANAGE_MEMBERS"}
          onClose={modalData.closeModal}
          entity={modalData.entityForDialog as ManagingEntity}
          allUsers={allUsers}
          memberActions={{
            add: memberData.handleAddMember,
            remove: memberData.handleRemoveMember,
            updateRole: memberData.handleChangeMemberRole,
          }}
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
        <ProjectFormDialog
          isOpen={
            modalData.modal?.view === "ADD_PROJECT" ||
            modalData.modal?.view === "EDIT_PROJECT"
          }
          onClose={modalData.closeModal}
          onSubmit={projectData.handleSaveProject}
          isLoading={!!projectData.loadingAction}
          initialData={modalData.projectForEdit}
        />
        <VlogFormDialog
          isOpen={
            modalData.modal?.view === "ADD_VLOG" ||
            modalData.modal?.view === "EDIT_VLOG"
          }
          onClose={modalData.closeModal}
          onSubmit={vlogData.handleSaveVlog}
          isLoading={!!vlogData.loadingAction}
          initialData={modalData.vlogForEdit}
        />
      </>
    ),
    [
      modalData,
      userData,
      teamData,
      departmentData,
      pageActions,
      memberData,
      calendarData,
      allUsers,
      allDepartments,
      projectData.handleSaveProject,
      projectData.loadingAction,
      vlogData.handleSaveVlog,
      vlogData.loadingAction,
    ]
  );

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage all aspects of the ITC Hub.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={pageActions.handleRefreshData}
            disabled={pageActions.loadingAction === "refresh"}
          >
            <RefreshCw
              className={`h-4 w-4 ${
                pageActions.loadingAction === "refresh" ? "animate-spin" : ""
              }`}
            />
          </Button>
          <Button
            variant="outline"
            onClick={pageActions.handleExportData}
            disabled={pageActions.loadingAction === "export"}
          >
            <Download className="mr-2 h-4 w-4" />
            export Data
          </Button>
        </div>
      </header>

      <StatsCards
        users={userData.users}
        teams={teamData.teams}
        departments={departmentData.departments}
      />

      <AdminTabs
        userData={userData}
        teamData={teamData}
        departmentData={departmentData}
        eventRequestData={eventRequestData}
        calendarData={calendarData}
        projectData={projectData}
        vlogData={vlogData}
        contentRequestData={contentRequestData}
        onSetModal={modalData.setModal}
        loadingAction={pageActions.loadingAction}
      />

      {dialogs}
    </div>
  );
}
import {
  useUserFormDialog,
  useProjectFormDialog,
  useVlogFormDialog,
} from "./hook";
function UserFormDialog({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  initialData,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormData & { id?: string }) => void;
  isLoading: boolean;
  initialData?: User | null;
}) {
  const { handleFormSubmit, isEditMode, form } = useUserFormDialog({
    isOpen,
    onSubmit,
    initialData,
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit User" : "Add New User"}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? `Update the details for ${initialData?.name ?? "this user"}.`
              : "Create a new user account."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-4 pt-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Sami" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="e.g. sami@itc.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditMode ? "Save Changes" : "Add User"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
import { useTeamFormDialog } from "./hook";
export function TeamFormDialog({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  initialData,
  departments,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TeamFormData & { id?: string }) => void;
  isLoading: boolean;
  initialData?: Team | null;
  departments: Department[];
}) {
  const { handleFormSubmit, isEditMode, form } = useTeamFormDialog({
    isOpen,
    onSubmit,
    initialData,
  });
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Team" : "Create New Team"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? `Update the details for ${initialData?.name ?? "this team"}.`
              : "Set up a new team within a department."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-4 pt-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Frontend Avengers" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A short description of the team's purpose."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="departmentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a department" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditMode ? "Save Changes" : "Create Team"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
import { useDepartmentFormDialog } from "./hook";
export function DepartmentFormDialog({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  initialData,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DepartmentFormData & { id?: string }) => void;
  isLoading: boolean;
  initialData?: Department | null;
}) {
  const { handleFormSubmit, isEditMode, form } = useDepartmentFormDialog({
    isOpen,
    onSubmit,
    initialData,
  });
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Department" : "Create New Department"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? `Update the details for ${
                  initialData?.name ?? "this department"
                }.`
              : "Set up a new department."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-4 pt-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Engineering" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What is the purpose of this department?"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditMode ? "Save Changes" : "Create Department"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export function ActionConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  title,
  description,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  title: string;
  description: string;
}) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} disabled={isLoading}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} asChild>
            <Button disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
import { useManageMembersDialog } from "./hook";
// This type is local to this component, so it's defined here.
type ManagingEntity =
  | ({ entityType: "team" } & Team)
  | ({ entityType: "department" } & Department)
  | null;

export function ManageMembersDialog({
  isOpen,
  onClose,
  entity,
  allUsers,
  memberActions,
}: {
  isOpen: boolean;
  onClose: () => void;
  entity: ManagingEntity;
  allUsers: User[];
  memberActions: {
    add: (
      entityId: string,
      entityType: "team" | "department",
      userId: string,
      role: "manager" | "member"
    ) => void;
    remove: (
      entityId: string,
      entityType: "team" | "department",
      userId: string
    ) => void;
    updateRole: (
      entityId: string,
      entityType: "team" | "department",
      userId: string,
      newRole: "manager" | "member"
    ) => void;
  };
}) {
  const {
    handleAddClick,
    getUserById,
    potentialNewMembers,
    roles,
    selectedUser,
    selectedRole,
    setSelectedUser,
    setSelectedRole,
  } = useManageMembersDialog({
    entity,
    allUsers,
    memberActions,
  });

  if (!entity) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Manage Members for {entity.name}</DialogTitle>
          <DialogDescription>
            Add, remove, and assign roles to members.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          {/* Add New Member Form */}
          <div className="flex items-end gap-2 p-4 border rounded-lg">
            <div className="flex-grow space-y-2">
              <label className="text-sm font-medium">Add New Member</label>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a user to add" />
                </SelectTrigger>
                <SelectContent>
                  {potentialNewMembers.length > 0 ? (
                    potentialNewMembers.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </SelectItem>
                    ))
                  ) : (
                    <p className="p-4 text-sm text-muted-foreground">
                      No users available to add.
                    </p>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <Select
                value={selectedRole}
                onValueChange={(r: "manager" | "member") => setSelectedRole(r)}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAddClick} disabled={!selectedUser}>
              <UserPlus className="h-4 w-4" />
            </Button>
          </div>

          {/* Current Members Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entity.members.length > 0 ? (
                  entity.members.map((member) => {
                    const user = getUserById(member.userId);
                    return user ? (
                      <TableRow key={member.userId}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>
                          <Select
                            value={member.role}
                            onValueChange={(newRole: "manager" | "member") =>
                              memberActions.updateRole(
                                entity.id,
                                entity.entityType,
                                member.userId,
                                newRole
                              )
                            }
                          >
                            <SelectTrigger className="w-32 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {roles.map((role) => (
                                <SelectItem key={role.value} value={role.value}>
                                  {role.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              memberActions.remove(
                                entity.id,
                                entity.entityType,
                                member.userId
                              )
                            }
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ) : null;
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-center text-muted-foreground py-4"
                    >
                      No members yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
import { useCreateEventDialog } from "./hook";
export function CreateEventDialog({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  initialData,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EventFormData & { id?: string }) => Promise<boolean>;
  isLoading: boolean;
  initialData?: Event | null;
}) {
  const { handleFormSubmit, form, isEditMode } = useCreateEventDialog({
    isOpen,
    onClose,
    onSubmit,
    initialData,
  });
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Event" : "Create New Event"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the details for this event."
              : "Add a new event to the calendar."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-4 pt-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Q4 Planning" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A brief description of the event..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="30">30 min</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="90">1.5 hours</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="meeting">Meeting</SelectItem>
                        <SelectItem value="review">Review</SelectItem>
                        <SelectItem value="planning">Planning</SelectItem>
                        <SelectItem value="workshop">Workshop</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Conference Room A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditMode ? "Save Changes" : "Create Event"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

/**
 * @component EventDetailsDialog
 * @description Displays the details of a selected calendar event and provides options to edit or delete it.
 * @param {object} props - The component props.
 * @param {Event | null} props.event - The event to display.
 * @param {() => void} props.onClose - Function to close the dialog.
 * @param {(event: Event) => void} props.onEdit - Function to handle editing the event.
 * @param {(event: Event) => void} props.onDelete - Function to handle deleting the event.
 * @returns {JSX.Element | null} - The rendered dialog or null if no event is selected.
 */

export function EventDetailsDialog({
  event,
  onClose,
  onEdit,
  onDelete,
}: {
  event: Event | null;
  onClose: () => void;
  onEdit: (event: Event) => void;
  onDelete: (event: Event) => void;
}) {
  if (!event) return null;

  return (
    <Dialog open={!!event} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold">
                {event.title}
              </DialogTitle>
              <DialogDescription className="mt-1">
                <Badge variant="outline" className="capitalize">
                  {event.type}
                </Badge>
              </DialogDescription>
            </div>
            <div className={`w-4 h-4 rounded-full mt-2 ${event.color}`}></div>
          </div>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-muted-foreground">{event.description}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>
                {new Date(`${event.date}T00:00:00`).toLocaleDateString(
                  "en-US",
                  {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>
                {event.time} ({event.duration} min)
              </span>
            </div>
            <div className="flex items-center gap-2 col-span-full">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{event.location}</span>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">Attendees</h4>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{event.attendees.join(", ")}</span>
            </div>
          </div>
        </div>
        <DialogFooter className="sm:justify-between gap-2">
          <Button variant="destructive" onClick={() => onDelete(event)}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={() => onEdit(event)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function StatsCards({
  users,
  teams,
  departments,
}: {
  users: User[];
  teams: Team[];
  departments: Department[];
}) {
  const pendingUsers = useMemo(
    () => users.filter((u) => u.status === "pending").length,
    [users]
  );
  const activeTeams = useMemo(
    () => teams.filter((t) => t.status === "active").length,
    [teams]
  );

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-500">{users.length}</div>
          <p className="text-xs text-muted-foreground">
            {pendingUsers} pending
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Teams</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-500">{activeTeams}</div>
          <p className="text-xs text-muted-foreground">{teams.length} total</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Departments</CardTitle>
          <Building2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-500">
            {departments.length}
          </div>
          <p className="text-xs text-muted-foreground">All active</p>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * @component AdminTabs
 * @description Renders the main tabbed interface for the admin dashboard, delegating content rendering to specialized child components.
 * @param {object} props - The component props.
 * @returns {JSX.Element} - The rendered tabs component.
 */

export function AdminTabs({
  userData,
  teamData,
  departmentData,
  eventRequestData,
  calendarData,
  projectData,
  vlogData,
  contentRequestData,
  onSetModal,
  loadingAction,
}: {
  userData: ReturnType<typeof useAdminPage>["userData"];
  teamData: ReturnType<typeof useAdminPage>["teamData"];
  departmentData: ReturnType<typeof useAdminPage>["departmentData"];
  eventRequestData: ReturnType<typeof useAdminPage>["eventRequestData"];
  calendarData: ReturnType<typeof useAdminPage>["calendarData"];
  projectData: ReturnType<typeof useAdminPage>["projectData"];
  vlogData: ReturnType<typeof useAdminPage>["vlogData"];
  contentRequestData: ReturnType<typeof useAdminPage>["contentRequestData"];
  onSetModal: (modal: ModalState) => void;
  loadingAction: string | null;
}) {
  return (
    <Tabs defaultValue="users" className="space-y-4">
      <TabsList className="grid w-full grid-cols-7">
        <TabsTrigger value="users">Users</TabsTrigger>
        <TabsTrigger value="teams">Teams</TabsTrigger>
        <TabsTrigger value="departments">Departments</TabsTrigger>
        <TabsTrigger value="calendar">Calendar</TabsTrigger>
        <TabsTrigger value="requests">Requests</TabsTrigger>
        <TabsTrigger value="projects">Projects</TabsTrigger>
        <TabsTrigger value="vlogs">Vlogs</TabsTrigger>
      </TabsList>

      <TabsContent value="users" className="space-y-4">
        <UserTab userData={userData} onSetModal={onSetModal} />
      </TabsContent>

      <TabsContent value="teams" className="space-y-4">
        <TeamTab teamData={teamData} onSetModal={onSetModal} />
      </TabsContent>

      <TabsContent value="departments" className="space-y-4">
        <DepartmentTab
          departmentData={departmentData}
          onSetModal={onSetModal}
        />
      </TabsContent>

      <TabsContent value="calendar" className="space-y-4">
        <CalendarTab calendarData={calendarData} />
      </TabsContent>

      <TabsContent value="requests" className="space-y-4">
        <RequestTab
          eventRequestData={eventRequestData}
          contentRequestData={contentRequestData}
          loadingAction={loadingAction}
        />
      </TabsContent>
      <TabsContent value="projects" className="space-y-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Project Management</CardTitle>
              <CardDescription>
                Manage projects and their publication status.
              </CardDescription>
            </div>
            <Button onClick={() => onSetModal({ view: "ADD_PROJECT" })}>
              <Plus className="mr-2 h-4 w-4" />
              Add Project
            </Button>
          </CardHeader>
          <CardContent>
            <ProjectsTable
              projects={projectData.projects}
              onEdit={(project) =>
                onSetModal({ view: "EDIT_PROJECT", data: project })
              }
              onDelete={projectData.handleDeleteProject}
              onUpdateStatus={projectData.handleUpdateStatus}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="vlogs" className="space-y-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Vlog Management</CardTitle>
              <CardDescription>
                Manage vlogs and their publication status.
              </CardDescription>
            </div>
            <Button onClick={() => onSetModal({ view: "ADD_VLOG" })}>
              <Plus className="mr-2 h-4 w-4" />
              Add Vlog
            </Button>
          </CardHeader>
          <CardContent>
            <VlogsTable
              vlogs={vlogData.vlogs}
              onEdit={(vlog) => onSetModal({ view: "EDIT_VLOG", data: vlog })}
              onDelete={vlogData.handleDeleteVlog}
              onUpdateStatus={vlogData.handleUpdateStatus}
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

export function UserTab({
  userData,
  onSetModal,
}: {
  userData: ReturnType<typeof useAdminPage>["userData"];
  onSetModal: (modal: ModalState) => void;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            Add, edit, and manage user accounts.
          </CardDescription>
        </div>
        <Button onClick={() => onSetModal({ view: "ADD_USER" })}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </CardHeader>
      <CardContent>
        <UsersTable users={userData.users} onSetModal={onSetModal} />
      </CardContent>
    </Card>
  );
}

export function TeamTab({
  teamData,
  onSetModal,
}: {
  teamData: ReturnType<typeof useAdminPage>["teamData"];
  onSetModal: (modal: ModalState) => void;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Team Management</CardTitle>
          <CardDescription>
            Create teams and manage their members.
          </CardDescription>
        </div>
        <Button onClick={() => onSetModal({ view: "ADD_TEAM" })}>
          <Plus className="mr-2 h-4 w-4" />
          Create Team
        </Button>
      </CardHeader>
      <CardContent>
        <TeamsTable teams={teamData.teams} onSetModal={onSetModal} />
      </CardContent>
    </Card>
  );
}

export function DepartmentTab({
  departmentData,
  onSetModal,
}: {
  departmentData: ReturnType<typeof useAdminPage>["departmentData"];
  onSetModal: (modal: ModalState) => void;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Department Management</CardTitle>
          <CardDescription>
            Create departments and assign members.
          </CardDescription>
        </div>
        <Button onClick={() => onSetModal({ view: "ADD_DEPARTMENT" })}>
          <Plus className="mr-2 h-4 w-4" />
          Create Department
        </Button>
      </CardHeader>
      <CardContent>
        <DepartmentsTable
          departments={departmentData.departments}
          onSetModal={onSetModal}
        />
      </CardContent>
    </Card>
  );
}

export function CalendarTab({
  calendarData,
}: {
  calendarData: ReturnType<typeof useAdminPage>["calendarData"];
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-4">
      <div className="lg:col-span-3">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Calendar className="h-5 w-5" />
                {calendarData.utils.formatDate(calendarData.currentDate)}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => calendarData.actions.navigate("prev")}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => calendarData.actions.navigate("next")}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <CalendarView calendarData={calendarData} />
          </CardContent>
        </Card>
      </div>
      <CalendarSidebar calendarData={calendarData} />
    </div>
  );
}

export function RequestTab({
  eventRequestData,
  contentRequestData,
  loadingAction,
}: {
  eventRequestData: ReturnType<typeof useAdminPage>["eventRequestData"];
  contentRequestData: ReturnType<typeof useAdminPage>["contentRequestData"];
  loadingAction: string | null;
}) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Event Requests</CardTitle>
          <CardDescription>
            Review and approve event submissions from teams and departments.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RequestsTable
            pendingEvents={eventRequestData.pendingEvents}
            handleRejectEvent={eventRequestData.handleRejectEvent}
            handleAcceptEvent={eventRequestData.handleAcceptEvent}
            loadingAction={loadingAction}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Content Requests</CardTitle>
          <CardDescription>
            Review and approve project and vlog submissions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ContentRequestsTable
            pendingProjects={contentRequestData.pendingProjects}
            pendingVlogs={contentRequestData.pendingVlogs}
            onApproveProject={contentRequestData.handleApproveProject}
            onRejectProject={contentRequestData.handleRejectProject}
            onApproveVlog={contentRequestData.handleApproveVlog}
            onRejectVlog={contentRequestData.handleRejectVlog}
            loadingAction={contentRequestData.loadingAction}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export function UsersTable({
  users,
  onSetModal,
}: {
  users: User[];
  onSetModal: (modal: ModalState) => void;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user: User) => (
          <TableRow key={user.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {user.email}
                  </div>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant={getStatusBadgeVariant(user.status)}>
                {user.status}
              </Badge>
              {user.status === "pending" && (
                <Button
                  size="sm"
                  variant="outline"
                  className="ml-2 h-7 px-2"
                  onClick={() =>
                    onSetModal({ view: "VERIFY_USER", data: user })
                  }
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verify
                </Button>
              )}
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() =>
                      onSetModal({ view: "EDIT_USER", data: user })
                    }
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit User
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => alert(`Sending email to ${user.email}`)}
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Send Email
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() =>
                      onSetModal({ view: "DELETE_USER", data: user })
                    }
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete User
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function TeamsTable({
  teams,
  onSetModal,
}: {
  teams: Team[];
  onSetModal: (modal: ModalState) => void;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Team</TableHead>
          <TableHead>Leader</TableHead>
          <TableHead>Members</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {teams.map((team: Team) => (
          <TableRow key={team.id}>
            <TableCell>
              <div className="font-medium">{team.name}</div>
              <div className="text-xs text-muted-foreground">
                {team.description}
              </div>
            </TableCell>
            <TableCell>
              {formatLeaders(
                team.leaders.map((l) => ({
                  ...l,
                  role: l.role.toLowerCase() as "user" | "manager" | "admin",
                }))
              )}
            </TableCell>
            <TableCell>{team.members.length}</TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() =>
                      onSetModal({
                        view: "MANAGE_MEMBERS",
                        data: { ...team, entityType: "team" },
                      })
                    }
                  >
                    <Users2 className="mr-2 h-4 w-4" />
                    Manage Members
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      onSetModal({ view: "EDIT_TEAM", data: team })
                    }
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Team
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() =>
                      onSetModal({ view: "DELETE_TEAM", data: team })
                    }
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Team
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function DepartmentsTable({
  departments,
  onSetModal,
}: {
  departments: Department[];
  onSetModal: (modal: ModalState) => void;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Department</TableHead>
          <TableHead>Manager</TableHead>
          <TableHead>Members</TableHead>
          <TableHead>Teams</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {departments.map((dept: Department) => (
          <TableRow key={dept.id}>
            <TableCell>
              <div className="font-medium">{dept.name}</div>
              <div className="text-xs text-muted-foreground">
                {dept.description}
              </div>
            </TableCell>
            <TableCell>
              {formatLeaders(
                dept.managers.map((m) => ({
                  ...m,
                  role: m.role.toLowerCase() as "user" | "manager" | "admin",
                }))
              )}
            </TableCell>
            <TableCell>{dept.members.length}</TableCell>
            <TableCell>{dept.teams?.length}</TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() =>
                      onSetModal({
                        view: "MANAGE_MEMBERS",
                        data: { ...dept, entityType: "department" },
                      })
                    }
                  >
                    <Users2 className="mr-2 h-4 w-4" />
                    Manage Members
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      onSetModal({ view: "EDIT_DEPARTMENT", data: dept })
                    }
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Department
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() =>
                      onSetModal({ view: "DELETE_DEPARTMENT", data: dept })
                    }
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Department
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function CalendarView({
  calendarData,
}: {
  calendarData: ReturnType<typeof useAdminPage>["calendarData"];
}) {
  const { currentDate, view, events, actions, utils } = calendarData;

  const getEventsForDate = (date: string) => {
    return events.filter((event) => event.date === date);
  };

  const renderMonthView = () => {
    const daysInMonth = utils.getDaysInMonth(currentDate);
    const firstDay = utils.getFirstDayOfMonth(currentDate);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="h-24 border-t border-r border-border/50"
        ></div>
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );
      const dateString = utils.formatDateString(date);
      const dayEvents = getEventsForDate(dateString);
      const isToday = dateString === utils.formatDateString(new Date());

      days.push(
        <div
          key={day}
          className={`h-24 border-t border-r border-border/50 p-1.5 space-y-1 overflow-hidden cursor-pointer hover:bg-accent/50 ${
            isToday ? "bg-primary/10" : ""
          }`}
          onClick={() => actions.handleDayClick(date)}
        >
          <div
            className={`text-xs font-medium ${
              isToday ? "text-primary font-bold" : "text-muted-foreground"
            }`}
          >
            {day}
          </div>
          {dayEvents.slice(0, 2).map((event) => (
            <div
              key={event.id}
              className={`text-white text-[10px] p-1 rounded truncate ${event.color}`}
              title={event.title}
              onClick={(e) => {
                e.stopPropagation();
                actions.setSelectedEvent(event);
              }}
            >
              {event.title}
            </div>
          ))}
          {dayEvents.length > 2 && (
            <div className="text-xs text-muted-foreground">
              +{dayEvents.length - 2} more
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-7 border-l border-b border-border/50">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="h-10 border-t border-r border-border/50 bg-muted/50 flex items-center justify-center font-medium text-sm"
          >
            {day}
          </div>
        ))}
        {days}
      </div>
    );
  };

  const renderWeekView = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    const weekDays: Date[] = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return date;
    });

    return (
      <div className="grid grid-cols-8 border-t border-l border-b border-border/50">
        <div className="h-10 border-r border-border/50 bg-muted/50"></div>
        {weekDays.map((day) => (
          <div
            key={day.toISOString()}
            className="h-14 border-r border-border/50 bg-muted/50 flex flex-col items-center justify-center font-medium text-sm cursor-pointer"
            onClick={() => actions.handleDayClick(day)}
          >
            <span>{day.toLocaleDateString("en-US", { weekday: "short" })}</span>
            <span
              className={`text-lg font-bold ${
                utils.formatDateString(day) ===
                utils.formatDateString(new Date())
                  ? "text-primary"
                  : ""
              }`}
            >
              {day.getDate()}
            </span>
          </div>
        ))}
        {Array.from({ length: 24 }, (_, i) => i + 8).map((hour) => (
          <div key={hour} className="contents">
            <div className="h-16 border-r border-t border-border/50 p-2 text-xs text-muted-foreground text-center">{`${hour}:00`}</div>
            {weekDays.map((day) => {
              const dayEvents = getEventsForDate(
                utils.formatDateString(day)
              ).filter((e) =>
                e.time ? parseInt(e.time.split(":")[0]) === hour : false
              );
              return (
                <div
                  key={day.toISOString()}
                  className="h-16 border-r border-t border-border/50 p-1 space-y-1 overflow-hidden"
                >
                  {dayEvents.map((event) => (
                    <div
                      key={event.id}
                      className={`text-white text-[10px] p-1 rounded truncate cursor-pointer ${event.color}`}
                      title={event.title}
                      onClick={() => actions.setSelectedEvent(event)}
                    >
                      {event.title}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  const renderDayView = () => {
    const dayToRender = currentDate;
    const dateString = utils.formatDateString(dayToRender);
    const dayEvents = getEventsForDate(dateString).sort((a, b) =>
      (a.time || "").localeCompare(b.time || "")
    );

    return (
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-xl font-semibold">
            {dayToRender.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </h3>
        </div>
        <div className="space-y-3">
          {dayEvents.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No events scheduled for this day.
            </div>
          ) : (
            dayEvents.map((event) => (
              <Card
                key={event.id}
                className="hover:bg-accent/50 transition-colors cursor-pointer"
                onClick={() => actions.setSelectedEvent(event)}
              >
                <CardContent className="p-4 flex items-start gap-4">
                  <div
                    className={`w-1.5 h-16 rounded-full ${event.color}`}
                  ></div>
                  <div className="flex-1 space-y-1">
                    <h4 className="font-semibold">{event.title}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        {event.time} ({event.duration} min)
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" />
                        {event.location}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      {event.attendees.join(", ")}
                    </div>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {event.type}
                  </Badge>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    );
  };

  switch (view) {
    case "month":
      return renderMonthView();
    case "week":
      return renderWeekView();
    case "day":
      return renderDayView();
    default:
      return renderMonthView();
  }
}

export function CalendarSidebar({
  calendarData,
}: {
  calendarData: ReturnType<typeof useAdminPage>["calendarData"];
}) {
  const { upcomingEvents, events, filterType, actions } = calendarData;
  const eventTypes = useMemo(
    () => ["all", ...Array.from(new Set(events.map((e) => e.type)))],
    [events]
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start bg-transparent"
            onClick={() => actions.setShowNewEventDialog(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
          <Select value={filterType} onValueChange={actions.setFilterType}>
            <SelectTrigger className="w-full justify-start bg-transparent">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter Events" />
            </SelectTrigger>
            <SelectContent>
              {eventTypes.map((type) => (
                <SelectItem key={type} value={type} className="capitalize">
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
          <CardDescription>Your next scheduled events.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {upcomingEvents.map((event) => (
            <div
              key={event.id}
              className="border rounded-lg p-3 hover:bg-accent/50 transition-colors cursor-pointer"
              onClick={() =>
                actions.setSelectedEvent(
                  events.find((e) => e.id === event.id) || null
                )
              }
            >
              <h4 className="font-medium">{event.title}</h4>
              <p className="text-sm text-muted-foreground">{event.date}</p>
              <div className="flex items-center justify-between mt-2">
                <Badge variant="secondary">{event.type}</Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {event.attendees}
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export function RequestsTable({
  pendingEvents,
  handleRejectEvent,
  handleAcceptEvent,
  loadingAction,
}: {
  pendingEvents: PendingEvent[];
  handleRejectEvent: (event: PendingEvent) => void;
  handleAcceptEvent: (event: PendingEvent) => void;
  loadingAction: string | null;
}) {
  if (pendingEvents.length === 0) {
    return (
      <Table>
        <TableBody>
          <TableRow>
            <TableCell
              colSpan={4}
              className="text-center text-muted-foreground py-8"
            >
              No pending event requests.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Event Title</TableHead>
          <TableHead>Submitted By</TableHead>
          <TableHead>Date & Time</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pendingEvents.map((event: PendingEvent) => (
          <TableRow key={event.id}>
            <TableCell>
              <div className="font-medium">{event.title}</div>
              <div className="text-xs text-muted-foreground truncate">
                {event.description}
              </div>
            </TableCell>
            <TableCell>
              <Badge
                variant={
                  event.submittedByType === "team" ? "secondary" : "outline"
                }
              >
                {event.submittedBy}
              </Badge>
            </TableCell>
            <TableCell>
              <div>{new Date(event.date).toLocaleDateString()}</div>
              <div className="text-xs text-muted-foreground">{event.time}</div>
            </TableCell>
            <TableCell className="text-right">
              <Button
                variant="outline"
                size="sm"
                className="mr-2"
                onClick={() => handleRejectEvent(event)}
                disabled={!!loadingAction}
              >
                <X className="h-4 w-4 mr-1" />
                Reject
              </Button>
              <Button
                size="sm"
                onClick={() => handleAcceptEvent(event)}
                disabled={!!loadingAction}
              >
                <Check className="h-4 w-4 mr-1" />
                Accept
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

// ===== STATUS BADGE COMPONENT =====
export const StatusBadge = ({ status }: { status: string }) => {
  const variants = {
    published: "default" as const,
    pending: "secondary" as const,
    draft: "outline" as const,
  };

  const variant = variants[status as keyof typeof variants] || "outline";

  return (
    <Badge variant={variant} className="capitalize">
      {status}
    </Badge>
  );
};

// ===== PROJECTS TABLE =====
export function ProjectsTable({
  projects,
  onEdit,
  onDelete,
  onUpdateStatus,
}: {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
  onUpdateStatus: (
    projectId: string,
    status: "draft" | "published" | "pending"
  ) => void;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Project</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Author</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={5}
              className="text-center text-muted-foreground py-8"
            >
              No projects found.
            </TableCell>
          </TableRow>
        ) : (
          projects.map((project) => (
            <TableRow key={project.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  {project.image && (
                    <Image
                      src={project.image}
                      alt={project.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded object-cover"
                    />
                  )}
                  <div>
                    <div className="font-medium">{project.name}</div>
                    <div className="text-sm text-muted-foreground line-clamp-1">
                      {project.description}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {project.type.replace("_", " ")}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={project.author.avatar || ""} />
                    <AvatarFallback className="text-xs">
                      {project.author.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{project.author.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <Select
                  value={project.status}
                  onValueChange={(value: "draft" | "published" | "pending") =>
                    onUpdateStatus(project.id, value)
                  }
                >
                  <SelectTrigger className="w-32 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() =>
                        window.open(`/projects/${project.slug}`, "_blank")
                      }
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Project
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(project)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Project
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => onDelete(project.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Project
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}

// ===== VLOGS TABLE =====
export function VlogsTable({
  vlogs,
  onEdit,
  onDelete,
  onUpdateStatus,
}: {
  vlogs: Vlog[];
  onEdit: (vlog: Vlog) => void;
  onDelete: (vlogId: string) => void;
  onUpdateStatus: (
    vlogId: string,
    status: "draft" | "published" | "pending"
  ) => void;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Vlog</TableHead>
          <TableHead>Author</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {vlogs.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={5}
              className="text-center text-muted-foreground py-8"
            >
              No vlogs found.
            </TableCell>
          </TableRow>
        ) : (
          vlogs.map((vlog) => (
            <TableRow key={vlog.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  {vlog.image && (
                    <Image
                      src={vlog.image}
                      alt={vlog.title}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded object-cover"
                    />
                  )}
                  <div>
                    <div className="font-medium">{vlog.title}</div>
                    <div className="text-sm text-muted-foreground line-clamp-1">
                      {vlog.description}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={vlog.author.avatar || ""} />
                    <AvatarFallback className="text-xs">
                      {vlog.author.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{vlog.author.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <Select
                  value={vlog.status}
                  onValueChange={(value: "draft" | "published" | "pending") =>
                    onUpdateStatus(vlog.id, value)
                  }
                >
                  <SelectTrigger className="w-32 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                {new Date(vlog.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() =>
                        window.open(`/vlogs/${vlog.slug}`, "_blank")
                      }
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Vlog
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(vlog)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Vlog
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => onDelete(vlog.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Vlog
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}

// ===== CONTENT REQUESTS TABLE =====
export function ContentRequestsTable({
  pendingProjects,
  pendingVlogs,
  onApproveProject,
  onRejectProject,
  onApproveVlog,
  onRejectVlog,
  loadingAction,
}: {
  pendingProjects: PendingProject[];
  pendingVlogs: PendingVlog[];
  onApproveProject: (projectId: string) => void;
  onRejectProject: (projectId: string) => void;
  onApproveVlog: (vlogId: string) => void;
  onRejectVlog: (vlogId: string) => void;
  loadingAction: string | null;
}) {
  const allRequests = [
    ...pendingProjects.map((p) => ({ ...p, type: "project" as const })),
    ...pendingVlogs.map((v) => ({ ...v, type: "vlog" as const })),
  ].sort(
    (a, b) =>
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Submitted By</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {allRequests.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={5}
              className="text-center text-muted-foreground py-8"
            >
              No pending requests.
            </TableCell>
          </TableRow>
        ) : (
          allRequests.map((request) => (
            <TableRow key={`${request.type}-${request.id}`}>
              <TableCell>
                <Badge variant="outline" className="gap-1">
                  {request.type === "project" ? (
                    <>
                      <FileText className="h-3 w-3" /> Project
                    </>
                  ) : (
                    <>
                      <Video className="h-3 w-3" /> Vlog
                    </>
                  )}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="font-medium">
                  {"name" in request ? request.name : request.title}
                </div>
                <div className="text-sm text-muted-foreground line-clamp-1">
                  {request.description}
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    request.submittedByType === "team" ? "secondary" : "outline"
                  }
                >
                  {request.submittedBy}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(request.submittedAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  className="mr-2"
                  onClick={() =>
                    request.type === "project"
                      ? onRejectProject(request.id)
                      : onRejectVlog(request.id)
                  }
                  disabled={!!loadingAction}
                >
                  <X className="h-4 w-4 mr-1" />
                  Reject
                </Button>
                <Button
                  size="sm"
                  onClick={() =>
                    request.type === "project"
                      ? onApproveProject(request.id)
                      : onApproveVlog(request.id)
                  }
                  disabled={!!loadingAction}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Approve
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}

// ===== PROJECT FORM DIALOG =====
export function ProjectFormDialog({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  initialData,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProjectFormData & { id?: string }) => Promise<boolean>;
  isLoading: boolean;
  initialData?: Project | null;
}) {
  const { handleFormSubmit, isEditMode, form } = useProjectFormDialog({
    isOpen,
    onSubmit,
    initialData,
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Project" : "Create New Project"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the project details."
              : "Add a new project to the platform."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => handleFormSubmit(data))}
            className="space-y-4 pt-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. AI Assistant" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. ai-assistant" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of the project..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="AI">AI</SelectItem>
                        <SelectItem value="UI_UX">UI/UX</SelectItem>
                        <SelectItem value="SOFTWARE">Software</SelectItem>
                        <SelectItem value="WEB_DEV">Web Development</SelectItem>
                        <SelectItem value="NETWORKING">Networking</SelectItem>
                        <SelectItem value="SECURITY">Security</SelectItem>
                        <SelectItem value="DEV_OPS">DevOps</SelectItem>
                        <SelectItem value="VFX">VFX</SelectItem>
                        <SelectItem value="MEDIA">Media</SelectItem>
                        <SelectItem value="ROBOTICS">Robotics</SelectItem>
                        <SelectItem value="GAME_DEV">
                          Game Development
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (comma-separated)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. AI, Machine Learning, Python"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="projectLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Link (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="githubLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub Link (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://github.com/..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditMode ? "Save Changes" : "Create Project"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// ===== VLOG FORM DIALOG =====
export function VlogFormDialog({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  initialData,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: VlogFormData & { id?: string }) => Promise<boolean>;
  isLoading: boolean;
  initialData?: Vlog | null;
}) {
  const { handleFormSubmit, isEditMode, form } = useVlogFormDialog({
    isOpen,
    onSubmit,
    initialData,
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Vlog" : "Create New Vlog"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the vlog details."
              : "Add a new vlog to the platform."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => handleFormSubmit(data))}
            className="space-y-4 pt-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vlog Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Team Building Event"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. team-building-event"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of the vlog..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditMode ? "Save Changes" : "Create Vlog"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
