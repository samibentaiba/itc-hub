// /admin/client.tsx
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  Shield, Download, RefreshCw, UserPlus, Plus, MoreVertical, Edit, Trash2,
  CheckCircle, Mail, Users2, Calendar, ChevronLeft, ChevronRight, Check, X,
  Filter, Users, Clock, MapPin, Loader2, Building2
} from "lucide-react";

// Import hook and types
import { useAdminPage } from "./hook";
import type {
  User, Team, Department, Event, UpcomingEvent, PendingEvent,
  EventFormData, UserFormData, TeamFormData, DepartmentFormData, Member
} from "./types";
import { eventFormSchema, userFormSchema, teamFormSchema, departmentFormSchema } from "./types";

// ===== STATS CARDS COMPONENT =====
interface StatsCardsProps {
  users: User[];
  teams: Team[];
  departments: Department[];
}

function StatsCards({ users, teams, departments }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-500">{users.length}</div>
          <p className="text-xs text-muted-foreground">{users.filter((u) => u.status === "pending").length} pending</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Teams</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-500">{teams.filter((t) => t.status === "active").length}</div>
          <p className="text-xs text-muted-foreground">{teams.length} total</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Departments</CardTitle>
          <Building2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-500">{departments.length}</div>
          <p className="text-xs text-muted-foreground">All active</p>
        </CardContent>
      </Card>
    </div>
  );
}

// ===== CALENDAR VIEW COMPONENT =====
interface CalendarViewProps {
  currentDate: Date;
  view: "month" | "week" | "day";
  events: Event[];
  setSelectedEvent: (event: Event | null) => void;
  handleDayClick: (date: Date) => void;
  getDaysInMonth: (date: Date) => number;
  getFirstDayOfMonth: (date: Date) => number;
  formatDateString: (date: Date) => string;
}

function CalendarView({ currentDate, view, events, setSelectedEvent, handleDayClick, getDaysInMonth, getFirstDayOfMonth, formatDateString }: CalendarViewProps) {

  const getEventsForDate = (date: string) => {
    return events.filter((event) => event.date === date);
  };

  const renderMonthView = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border-t border-r border-border/50"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateString = formatDateString(date);
      const dayEvents = getEventsForDate(dateString);
      const isToday = dateString === formatDateString(new Date());

      days.push(
        <div key={day} className={`h-24 border-t border-r border-border/50 p-1.5 space-y-1 overflow-hidden cursor-pointer hover:bg-accent/50 ${isToday ? "bg-primary/10" : ""}`} onClick={() => handleDayClick(date)}>
          <div className={`text-xs font-medium ${isToday ? "text-primary font-bold" : "text-muted-foreground"}`}>{day}</div>
          {dayEvents.slice(0, 2).map((event) => (
            <div key={event.id} className={`text-white text-[10px] p-1 rounded truncate ${event.color}`} title={event.title} onClick={(e) => { e.stopPropagation(); setSelectedEvent(event); }}>
              {event.title}
            </div>
          ))}
          {dayEvents.length > 2 && <div className="text-xs text-muted-foreground">+{dayEvents.length - 2} more</div>}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-7 border-l border-b border-border/50">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="h-10 border-t border-r border-border/50 bg-muted/50 flex items-center justify-center font-medium text-sm">{day}</div>
        ))}
        {days}
      </div>
    );
  };

  const renderWeekView = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    const weekDays: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDays.push(date);
    }

    return (
      <div className="grid grid-cols-8 border-t border-l border-b border-border/50">
        <div className="h-10 border-r border-border/50 bg-muted/50"></div>
        {weekDays.map(day => (
          <div key={day.toISOString()} className="h-14 border-r border-border/50 bg-muted/50 flex flex-col items-center justify-center font-medium text-sm cursor-pointer" onClick={() => handleDayClick(day)}>
            <span>{day.toLocaleDateString('en-US', { weekday: 'short' })}</span>
            <span className={`text-lg font-bold ${formatDateString(day) === formatDateString(new Date()) ? 'text-primary' : ''}`}>{day.getDate()}</span>
          </div>
        ))}
        {Array.from({ length: 24 }, (_, i) => i + 8).map(hour => (
          <div key={hour} className="contents">
            <div className="h-16 border-r border-t border-border/50 p-2 text-xs text-muted-foreground text-center">{`${hour}:00`}</div>
            {weekDays.map(day => {
              const dayEvents = getEventsForDate(formatDateString(day)).filter(e => parseInt(e.time.split(':')[0]) === hour);
              return (
                <div key={day.toISOString()} className="h-16 border-r border-t border-border/50 p-1 space-y-1 overflow-hidden">
                  {dayEvents.map(event => (
                    <div key={event.id} className={`text-white text-[10px] p-1 rounded truncate cursor-pointer ${event.color}`} title={event.title} onClick={() => setSelectedEvent(event)}>
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
    const dateString = formatDateString(dayToRender);
    const dayEvents = getEventsForDate(dateString).sort((a, b) => a.time.localeCompare(b.time));

    return (
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-xl font-semibold">{dayToRender.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</h3>
        </div>
        <div className="space-y-3">
          {dayEvents.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">No events scheduled for this day.</div>
          ) : (
            dayEvents.map((event) => (
              <Card key={event.id} className="hover:bg-accent/50 transition-colors cursor-pointer" onClick={() => setSelectedEvent(event)}>
                <CardContent className="p-4 flex items-start gap-4">
                  <div className={`w-1.5 h-16 rounded-full ${event.color}`}></div>
                  <div className="flex-1 space-y-1">
                    <h4 className="font-semibold">{event.title}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{event.time} ({event.duration} min)</span>
                      <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" />{event.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      {event.attendees.join(', ')}
                    </div>
                  </div>
                  <Badge variant="outline" className="capitalize">{event.type}</Badge>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    );
  };

  switch (view) {
    case "month": return renderMonthView();
    case "week": return renderWeekView();
    case "day": return renderDayView();
    default: return renderMonthView();
  }
}

// ===== CALENDAR SIDEBAR COMPONENT =====
interface CalendarSidebarProps {
  upcomingEvents: UpcomingEvent[];
  allEvents: Event[];
  filterType: string;
  onFilterChange: (type: string) => void;
  onNewEventClick: () => void;
  onEventClick: (event: Event | null) => void;
}

function CalendarSidebar({ upcomingEvents, allEvents, filterType, onFilterChange, onNewEventClick, onEventClick }: CalendarSidebarProps) {
  const eventTypes = ["all", ...Array.from(new Set(allEvents.map(e => e.type)))];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" className="w-full justify-start bg-transparent" onClick={onNewEventClick}>
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
          <Select value={filterType} onValueChange={onFilterChange}>
            <SelectTrigger className="w-full justify-start bg-transparent">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter Events" />
            </SelectTrigger>
            <SelectContent>
              {eventTypes.map(type => (
                <SelectItem key={type} value={type} className="capitalize">{type}</SelectItem>
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
            <div key={event.id} className="border rounded-lg p-3 hover:bg-accent/50 transition-colors cursor-pointer" onClick={() => onEventClick(allEvents.find(e => e.id === event.id) || null)}>
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

// ===== USER FORM DIALOG COMPONENT =====
interface UserFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormData & { id?: string }) => void;
  isLoading: boolean;
  initialData?: User | null;
}

function UserFormDialog({ isOpen, onClose, onSubmit, isLoading, initialData }: UserFormDialogProps) {
  const isEditMode = !!initialData;

  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: { name: "", email: "" },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset(isEditMode ? { name: initialData.name, email: initialData.email } : { name: "", email: "" });
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
            {isEditMode ? `Update the details for ${initialData.name}.` : "Create a new user account."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 pt-4">
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
                    <Input type="email" placeholder="e.g. sami@itc.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
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

// ===== TEAM FORM DIALOG COMPONENT =====
interface TeamFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TeamFormData & { id?: string }) => void;
  isLoading: boolean;
  initialData?: Team | null;
  departments: Department[];
}

function TeamFormDialog({ isOpen, onClose, onSubmit, isLoading, initialData, departments }: TeamFormDialogProps) {
  const isEditMode = !!initialData;

  const form = useForm<TeamFormData>({
    resolver: zodResolver(teamFormSchema),
    defaultValues: { name: "", description: "", departmentId: "" },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset(isEditMode ? { name: initialData.name, description: initialData.description, departmentId: initialData.departmentId } : { name: "", description: "", departmentId: "" });
    }
  }, [isOpen, initialData, form, isEditMode]);

  const handleFormSubmit = (data: TeamFormData) => {
    onSubmit({ ...data, id: initialData?.id });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Team" : "Create New Team"}</DialogTitle>
          <DialogDescription>
            {isEditMode ? `Update details for the ${initialData.name} team.` : "Set up a new team within a department."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 pt-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem><FormLabel>Team Name</FormLabel><FormControl><Input placeholder="e.g. Frontend Avengers" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="A short description of the team's purpose." {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="departmentId" render={({ field }) => (
              <FormItem>
                <FormLabel>Department</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Select a department" /></SelectTrigger></FormControl>
                  <SelectContent>
                    {departments.map(dept => <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
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

// ===== DEPARTMENT FORM DIALOG COMPONENT =====
interface DepartmentFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DepartmentFormData & { id?: string }) => void;
  isLoading: boolean;
  initialData?: Department | null;
}

function DepartmentFormDialog({ isOpen, onClose, onSubmit, isLoading, initialData }: DepartmentFormDialogProps) {
  const isEditMode = !!initialData;

  const form = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentFormSchema),
    defaultValues: { name: "", description: "" },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset(isEditMode ? { name: initialData.name, description: initialData.description } : { name: "", description: "" });
    }
  }, [isOpen, initialData, form, isEditMode]);

  const handleFormSubmit = (data: DepartmentFormData) => {
    onSubmit({ ...data, id: initialData?.id });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Department" : "Create New Department"}</DialogTitle>
          <DialogDescription>
            {isEditMode ? `Update details for the ${initialData.name} department.` : "Set up a new department."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 pt-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem><FormLabel>Department Name</FormLabel><FormControl><Input placeholder="e.g. Engineering" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="What is the purpose of this department?" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
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

// ===== ACTION CONFIRMATION DIALOG COMPONENT =====
interface ActionConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  title: string;
  description: string;
}

function ActionConfirmationDialog({
  isOpen, onClose, onConfirm, isLoading, title, description
}: ActionConfirmationDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} disabled={isLoading}>Cancel</AlertDialogCancel>
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

// ===== MANAGE MEMBERS DIALOG COMPONENT =====
type ManagingEntity = (({ entityType: 'team' } & Team) | ({ entityType: 'department' } & Department)) | null;

interface ManageMembersDialogProps {
  isOpen: boolean;
  onClose: () => void;
  entity: ManagingEntity;
  allUsers: User[];
  onAddMember: (entityId: string, entityType: 'team' | 'department', userId: string, role: 'leader' | 'member') => void;
  onRemoveMember: (entityId: string, entityType: 'team' | 'department', userId: string) => void;
  onChangeMemberRole: (entityId: string, entityType: 'team' | 'department', userId: string, newRole: 'leader' | 'member') => void;
}

function ManageMembersDialog({
  isOpen, onClose, entity, allUsers, onAddMember, onRemoveMember, onChangeMemberRole
}: ManageMembersDialogProps) {
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedRole, setSelectedRole] = useState<'leader' | 'member'>("member");

  if (!entity) return null;

  const entityMembers = entity.members;
  const memberUserIds = new Set(entityMembers.map(m => m.userId));
  const potentialNewMembers = allUsers.filter(u => !memberUserIds.has(u.id));

  const getUserById = (userId: string) => allUsers.find(u => u.id === userId);

  const handleAddClick = () => {
    if (selectedUser && selectedRole) {
      onAddMember(entity.id, entity.entityType, selectedUser, selectedRole);
      setSelectedUser(""); // Reset dropdown
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Manage Members for {entity.name}</DialogTitle>
          <DialogDescription>Add, remove, and assign roles to members.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          {/* Add New Member Form */}
          <div className="flex items-end gap-2 p-4 border rounded-lg">
            <div className="flex-grow space-y-2">
              <label className="text-sm font-medium">Add New Member</label>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger><SelectValue placeholder="Select a user to add" /></SelectTrigger>
                <SelectContent>
                  {potentialNewMembers.length > 0 ? potentialNewMembers.map(user => (
                    <SelectItem key={user.id} value={user.id}>{user.name} ({user.email})</SelectItem>
                  )) : <p className="p-4 text-sm text-muted-foreground">No users available to add.</p>}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <Select value={selectedRole} onValueChange={(r: 'leader' | 'member') => setSelectedRole(r)}>
                <SelectTrigger className="w-[100px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="leader">Leader</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAddClick} disabled={!selectedUser}><UserPlus className="h-4 w-4" /></Button>
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
                {entityMembers.length > 0 ? entityMembers.map((member: { userId: string, role: 'leader' | 'member' }) => {
                  const user = getUserById(member.userId);
                  return user ? (
                    <TableRow key={member.userId}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>
                        <Select value={member.role} onValueChange={(newRole: 'leader' | 'member') => onChangeMemberRole(entity.id, entity.entityType, member.userId, newRole)}>
                          <SelectTrigger className="w-32 h-8"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="member">Member</SelectItem>
                            <SelectItem value="leader">Leader</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => onRemoveMember(entity.id, entity.entityType, member.userId)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ) : null;
                }) : (
                  <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground py-4">No members yet.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ===== CREATE EVENT DIALOG COMPONENT =====
interface CreateEventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EventFormData & { id?: string }) => Promise<boolean>;
  isLoading: boolean;
  initialData?: Event | null;
}

function CreateEventDialog({ isOpen, onClose, onSubmit, isLoading, initialData }: CreateEventDialogProps) {
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
          description: initialData.description,
          date: initialData.date,
          time: initialData.time,
          duration: String(initialData.duration),
          type: initialData.type as "meeting" | "review" | "planning" | "workshop",
          location: initialData.location,
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
    if (success) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Event" : "Create New Event"}</DialogTitle>
          <DialogDescription>
            {isEditMode ? "Update the details for this event." : "Add a new event to the calendar."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Title</FormLabel>
                  <FormControl><Input placeholder="e.g., Q4 Planning" {...field} /></FormControl>
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
                  <FormControl><Textarea placeholder="A brief description of the event..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="date" render={({ field }) => (<FormItem><FormLabel>Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="time" render={({ field }) => (<FormItem><FormLabel>Time</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="duration" render={({ field }) => (<FormItem><FormLabel>Duration</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="30">30 min</SelectItem><SelectItem value="60">1 hour</SelectItem><SelectItem value="90">1.5 hours</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="type" render={({ field }) => (<FormItem><FormLabel>Type</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="meeting">Meeting</SelectItem><SelectItem value="review">Review</SelectItem><SelectItem value="planning">Planning</SelectItem><SelectItem value="workshop">Workshop</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
            </div>
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location (Optional)</FormLabel>
                  <FormControl><Input placeholder="e.g., Conference Room A" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
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

// ===== EVENT DETAILS DIALOG COMPONENT =====
interface EventDetailsDialogProps {
  event: Event | null;
  onClose: () => void;
  onEdit: (event: Event) => void;
  onDelete: (event: Event) => void;
}

function EventDetailsDialog({ event, onClose, onEdit, onDelete }: EventDetailsDialogProps) {
  if (!event) return null;

  return (
    <Dialog open={!!event} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold">{event.title}</DialogTitle>
              <DialogDescription className="mt-1">
                <Badge variant="outline" className="capitalize">{event.type}</Badge>
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
              <span>{new Date(`${event.date}T00:00:00`).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{event.time} ({event.duration} min)</span>
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
              <span>{event.attendees.join(', ')}</span>
            </div>
          </div>
        </div>
        <DialogFooter className="sm:justify-between gap-2">
          <Button variant="destructive" onClick={() => onDelete(event)}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>Close</Button>
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

// ===== ADMIN TABS COMPONENT =====
interface AdminTabsProps {
  users: User[];
  teams: Team[];
  departments: Department[];
  onSetModal: (modal: any) => void;
  pendingEvents: PendingEvent[];
  handleAcceptEvent: (event: PendingEvent) => void;
  handleRejectEvent: (event: PendingEvent) => void;
  loadingAction: string | null;
  calendarView: "month" | "week" | "day";
  currentDate: Date;
  events: Event[];
  upcomingEvents: UpcomingEvent[];
  filterType: string;
  onSetCalendarView: (view: "month" | "week" | "day") => void;
  onNavigateCalendar: (direction: "prev" | "next") => void;
  onSetSelectedEvent: (event: Event | null) => void;
  onNewEventClick: () => void;
  onFilterChange: (type: string) => void;
  onDayClick: (date: Date) => void;
  formatDate: (date: Date) => string;
  getDaysInMonth: (date: Date) => number;
  getFirstDayOfMonth: (date: Date) => number;
  formatDateString: (date: Date) => string;
}

function AdminTabs({
  users,
  teams,
  departments,
  onSetModal,
  pendingEvents,
  handleAcceptEvent,
  handleRejectEvent,
  loadingAction,
  calendarView,
  currentDate,
  events,
  upcomingEvents,
  filterType,
  onSetCalendarView,
  onNavigateCalendar,
  onSetSelectedEvent,
  onNewEventClick,
  onFilterChange,
  onDayClick,
  formatDate,
  getDaysInMonth,
  getFirstDayOfMonth,
  formatDateString,
}: AdminTabsProps) {
  const getStatusBadgeVariant = (status: string) =>
    status === "verified" ? "default" : "secondary";
  const getUserNameById = (userId: string) =>
    users.find((u) => u.id === userId)?.name;

  const formatLeaders = (leaders: User[]) => {
    if (!leaders || leaders.length === 0) {
      return "N/A";
    }
    if (leaders.length === 1) {
      return leaders[0].name;
    }
    return `${leaders[0].name} +${leaders.length - 1}`;
  };

  return (
    <Tabs defaultValue="users" className="space-y-4">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="users">Users</TabsTrigger>
        <TabsTrigger value="teams">Teams</TabsTrigger>
        <TabsTrigger value="departments">Departments</TabsTrigger>
        <TabsTrigger value="calendar">Calendar</TabsTrigger>
        <TabsTrigger value="requests">Event Requests</TabsTrigger>
      </TabsList>

      {/* Users Tab */}
      <TabsContent value="users" className="space-y-4">
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
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
                            onClick={() =>
                              alert(`Sending email to ${user.email}`)
                            }
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
          </CardContent>
        </Card>
      </TabsContent>

      {/* Teams Tab */}
      <TabsContent value="teams" className="space-y-4">
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
                {teams.map((team) => {
                  return (
                    <TableRow key={team.id}>
                      <TableCell>
                        <div className="font-medium">{team.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {team.description}
                        </div>
                      </TableCell>
                      <TableCell>{formatLeaders(team.leaders)}</TableCell>
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
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Departments Tab */}
      <TabsContent value="departments" className="space-y-4">
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
                {departments.map((dept) => {
                  return (
                    <TableRow key={dept.id}>
                      <TableCell>
                        <div className="font-medium">{dept.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {dept.description}
                        </div>
                      </TableCell>
                      <TableCell>{formatLeaders(dept.managers)}</TableCell>
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
                                onSetModal({
                                  view: "EDIT_DEPARTMENT",
                                  data: dept,
                                })
                              }
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Department
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() =>
                                onSetModal({
                                  view: "DELETE_DEPARTMENT",
                                  data: dept,
                                })
                              }
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Department
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Calendar Tab */}
      <TabsContent value="calendar" className="space-y-4">
        <div className="grid gap-6 lg:grid-cols-4">
          {/* Main Calendar View */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Calendar className="h-5 w-5" />
                    {formatDate(currentDate)}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Select
                      value={calendarView}
                      onValueChange={(v) =>
                        onSetCalendarView(v as "month" | "week" | "day")
                      }
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="month">Month</SelectItem>
                        <SelectItem value="week">Week</SelectItem>
                        <SelectItem value="day">Day</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onNavigateCalendar("prev")}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onNavigateCalendar("next")}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CalendarView
                  currentDate={currentDate}
                  view={calendarView}
                  events={events}
                  setSelectedEvent={onSetSelectedEvent}
                  handleDayClick={onDayClick}
                  getDaysInMonth={getDaysInMonth}
                  getFirstDayOfMonth={getFirstDayOfMonth}
                  formatDateString={formatDateString}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <CalendarSidebar
            upcomingEvents={upcomingEvents}
            allEvents={events}
            filterType={filterType}
            onFilterChange={onFilterChange}
            onNewEventClick={onNewEventClick}
            onEventClick={onSetSelectedEvent}
          />
        </div>
      </TabsContent>

      {/* Event Requests Tab */}
      <TabsContent value="requests" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Event Requests</CardTitle>
            <CardDescription>
              Review and approve event submissions from teams and departments.
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                {pendingEvents.length > 0 ? (
                  pendingEvents.map((event) => (
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
                            event.submittedByType === "team"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {event.submittedBy}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>{new Date(event.date).toLocaleDateString()}</div>
                        <div className="text-xs text-muted-foreground">
                          {event.time}
                        </div>
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
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-muted-foreground py-8"
                    >
                      No pending event requests.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

// ===== MAIN CLIENT PAGE COMPONENT =====
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
    userForEdit,
    teamForEdit,
    departmentForEdit,
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
                className={`mr-2 h-4 w-4 ${loadingAction === "refresh" ? "animate-spin" : ""
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
                className={`mr-2 h-4 w-4 ${loadingAction === "export" ? "animate-spin" : ""
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
        initialData={userForEdit}
      />

      <TeamFormDialog
        isOpen={modal?.view === "ADD_TEAM" || modal?.view === "EDIT_TEAM"}
        onClose={closeModal}
        onSubmit={(data) => handleSaveTeam(data).then(closeModal)}
        isLoading={isTeamFormLoading}
        initialData={teamForEdit}
        departments={departments}
      />

      <DepartmentFormDialog
        isOpen={
          modal?.view === "ADD_DEPARTMENT" || modal?.view === "EDIT_DEPARTMENT"
        }
        onClose={closeModal}
        onSubmit={(data) => handleSaveDepartment(data).then(closeModal)}
        isLoading={isDeptFormLoading}
        initialData={departmentForEdit}
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
        isOpen={["DELETE_USER",
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
            ? `This will permanently delete ${userForEdit?.name || "this user"}.`
            : modal?.view === "VERIFY_USER"
              ? `This will mark ${userForEdit?.name || "this user"} as verified.`
              : modal?.view === "DELETE_TEAM"
                ? `This will permanently delete the ${teamForEdit?.name || "this team"} team.`
                : modal?.view === "DELETE_DEPARTMENT"
                  ? `This will permanently delete the ${departmentForEdit?.name || "this department"} department and all its teams.`
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