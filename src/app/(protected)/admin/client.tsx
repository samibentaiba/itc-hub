"use client";

import { useState, useMemo, useEffect } from "react";
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
  Department,
  Event,
  UpcomingEvent,
  PendingEvent,
  ModalState,
} from "./types";
import {
  departmentFormSchema,
  userFormSchema,
  teamFormSchema,
  eventFormSchema,
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
import { formatLeaders,getStatusBadgeVariant } from "./utils";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
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
import { Card, CardContent, CardHeader, CardTitle ,CardDescription} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

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
        onSetModal={modalData.setModal}
        loadingAction={pageActions.loadingAction}
      />

      {dialogs}
    </div>
  );
}

interface UserFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormData & { id?: string }) => void;
  isLoading: boolean;
  initialData?: User | null;
}

function UserFormDialog({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  initialData,
}: UserFormDialogProps) {
  const isEditMode = !!initialData;
  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: { name: "", email: "" },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset(
        isEditMode && initialData
          ? { name: initialData.name, email: initialData.email }
          : { name: "", email: "" }
      );
    }
  }, [isOpen, initialData, form, isEditMode]);

  const handleFormSubmit = (data: UserFormData) => {
    onSubmit({ ...data, id: initialData?.id });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit User" : "Add New User"}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? `Update the details for ${initialData.name}.`
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

interface TeamFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TeamFormData & { id?: string }) => void;
  isLoading: boolean;
  initialData?: Team | null;
  departments: Department[];
}

export function TeamFormDialog({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  initialData,
  departments,
}: TeamFormDialogProps) {
  const isEditMode = !!initialData;
  const form = useForm<TeamFormData>({
    resolver: zodResolver(teamFormSchema),
    defaultValues: { name: "", description: "", departmentId: "" },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset(
        isEditMode && initialData
          ? {
              name: initialData.name,
              description: initialData.description ?? undefined,
              departmentId: initialData.departmentId,
            }
          : { name: "", description: "", departmentId: "" }
      );
    }
  }, [isOpen, initialData, form, isEditMode]);

  const handleFormSubmit = (data: TeamFormData) => {
    onSubmit({ ...data, id: initialData?.id });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Team" : "Create New Team"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? `Update details for the ${initialData.name} team.`
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

interface DepartmentFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DepartmentFormData & { id?: string }) => void;
  isLoading: boolean;
  initialData?: Department | null;
}

export function DepartmentFormDialog({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  initialData,
}: DepartmentFormDialogProps) {
  const isEditMode = !!initialData;
  const form = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentFormSchema),
    defaultValues: { name: "", description: "" },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset(
        isEditMode && initialData
          ? {
              name: initialData.name,
              description: initialData.description ?? undefined,
            }
          : { name: "", description: "" }
      );
    }
  }, [isOpen, initialData, form, isEditMode]);

  const handleFormSubmit = (data: DepartmentFormData) => {
    onSubmit({ ...data, id: initialData?.id });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Department" : "Create New Department"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? `Update details for the ${initialData.name} department.`
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

interface ActionConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  title: string;
  description: string;
}

export function ActionConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  title,
  description,
}: ActionConfirmationDialogProps) {
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

// This type is local to this component, so it's defined here.
type ManagingEntity =
  | ({ entityType: "team" } & Team)
  | ({ entityType: "department" } & Department)
  | null;

interface ManageMembersDialogProps {
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
}

export function ManageMembersDialog({
  isOpen,
  onClose,
  entity,
  allUsers,
  memberActions,
}: ManageMembersDialogProps) {
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedRole, setSelectedRole] = useState<"manager" | "member">(
    "member"
  );

  const memberUserIds = useMemo(
    () => (entity ? new Set(entity.members.map((m) => m.userId)) : new Set()),
    [entity]
  );
  const potentialNewMembers = useMemo(
    () => allUsers.filter((u) => !memberUserIds.has(u.id)),
    [allUsers, memberUserIds]
  );

  if (!entity) return null;

  const isTeam = entity.entityType === "team";
  const roles = [
    { value: "manager", label: isTeam ? "Leader" : "Manager" },
    { value: "member", label: "Member" },
  ];
  const getUserById = (userId: string) => allUsers.find((u) => u.id === userId);

  const handleAddClick = () => {
    if (selectedUser) {
      memberActions.add(
        entity.id,
        entity.entityType,
        selectedUser,
        selectedRole
      );
      setSelectedUser("");
      setSelectedRole("member");
    }
  };

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

interface CreateEventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EventFormData & { id?: string }) => Promise<boolean>;
  isLoading: boolean;
  initialData?: Event | null;
}

export function CreateEventDialog({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  initialData,
}: CreateEventDialogProps) {
  const isEditMode = !!initialData;
  const form = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      description: "",
      date: "",
      time: "",
      duration: "60",
      type: "meeting",
      location: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && initialData) {
        form.reset({
          title: initialData.title,
          description: initialData.description ?? undefined,
          date: initialData.date,
          time: initialData.time ?? "",
          duration: String(initialData.duration),
          type: initialData.type as
            | "meeting"
            | "review"
            | "planning"
            | "workshop",
          location: initialData.location ?? undefined,
        });
      } else {
        form.reset({
          title: "",
          description: "",
          date: new Date().toISOString().split("T")[0],
          time: "",
          duration: "60",
          type: "meeting",
          location: "",
        });
      }
    }
  }, [isOpen, initialData, isEditMode, form]);

  const handleFormSubmit = async (data: EventFormData) => {
    const success = await onSubmit({ ...data, id: initialData?.id });
    if (success) onClose();
  };

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

interface StatsCardsProps {
  users: User[];
  teams: Team[];
  departments: Department[];
}

export function StatsCards({ users, teams, departments }: StatsCardsProps) {
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
interface AdminTabsProps {
  userData: ReturnType<typeof useAdminPage>["userData"];
  teamData: ReturnType<typeof useAdminPage>["teamData"];
  departmentData: ReturnType<typeof useAdminPage>["departmentData"];
  eventRequestData: ReturnType<typeof useAdminPage>["eventRequestData"];
  calendarData: ReturnType<typeof useAdminPage>["calendarData"];
  onSetModal: (modal: ModalState) => void;
  loadingAction: string | null;
}

interface UserTabProps {
  userData: ReturnType<typeof useAdminPage>["userData"];
  onSetModal: (modal: ModalState) => void;
}

interface TeamTabProps {
  teamData: ReturnType<typeof useAdminPage>["teamData"];
  onSetModal: (modal: ModalState) => void;
}

interface DepartmentTabProps {
  departmentData: ReturnType<typeof useAdminPage>["departmentData"];
  onSetModal: (modal: ModalState) => void;
}

interface CalendarTabProps {
  calendarData: ReturnType<typeof useAdminPage>["calendarData"];
}

interface RequestTabProps {
  eventRequestData: ReturnType<typeof useAdminPage>["eventRequestData"];
  loadingAction: string | null;
}

interface UsersTableProps {
  users: User[];
  onSetModal: (modal: ModalState) => void;
}

interface TeamsTableProps {
  teams: Team[];
  onSetModal: (modal: ModalState) => void;
}

interface DepartmentsTableProps {
  departments: Department[];
  onSetModal: (modal: ModalState) => void;
}

interface RequestsTableProps {
  pendingEvents: PendingEvent[];
  handleRejectEvent: (event: PendingEvent) => void;
  handleAcceptEvent: (event: PendingEvent) => void;
  loadingAction: string | null;
}

export function AdminTabs({
  userData,
  teamData,
  departmentData,
  eventRequestData,
  calendarData,
  onSetModal,
  loadingAction,
}: AdminTabsProps) {
  return (
    <Tabs defaultValue="users" className="space-y-4">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="users">Users</TabsTrigger>
        <TabsTrigger value="teams">Teams</TabsTrigger>
        <TabsTrigger value="departments">Departments</TabsTrigger>
        <TabsTrigger value="calendar">Calendar</TabsTrigger>
        <TabsTrigger value="requests">Event Requests</TabsTrigger>
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
          loadingAction={loadingAction}
        />
      </TabsContent>
    </Tabs>
  );
}

export function UserTab({ userData, onSetModal }: UserTabProps) {
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

export function TeamTab({ teamData, onSetModal }: TeamTabProps) {
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

export function DepartmentTab({ departmentData, onSetModal }: DepartmentTabProps) {
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

export function CalendarTab({ calendarData }: CalendarTabProps) {
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

export function RequestTab({ eventRequestData, loadingAction }: RequestTabProps) {
  return (
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
  );
}

export function UsersTable({ users, onSetModal }: UsersTableProps) {
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

export function TeamsTable({ teams, onSetModal }: TeamsTableProps) {
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
            <TableCell>{formatLeaders(team.leaders.map(l => ({...l, role: l.role.toLowerCase()})) as any)}</TableCell>
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

export function DepartmentsTable({ departments, onSetModal }: DepartmentsTableProps) {
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
            <TableCell>{formatLeaders(dept.managers.map(m => ({...m, role: m.role.toLowerCase()})) as any)}</TableCell>
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

interface CalendarViewProps {
  calendarData: ReturnType<typeof useAdminPage>["calendarData"];
}

export function CalendarView({ calendarData }: CalendarViewProps) {
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

interface CalendarSidebarProps {
  calendarData: ReturnType<typeof useAdminPage>["calendarData"];
}

export function CalendarSidebar({ calendarData }: CalendarSidebarProps) {
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
}: RequestsTableProps) {
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
                onClick={() => handleRejectEvent(event.id)}
                disabled={!!loadingAction}
              >
                <X className="h-4 w-4 mr-1" />
                Reject
              </Button>
              <Button
                size="sm"
                onClick={() => handleAcceptEvent(event.id)}
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
