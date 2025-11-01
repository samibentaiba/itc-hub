// src/app/(protected)/departments/[departmentId]/client.tsx
"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthorizedComponent } from "@/hooks/use-authorization";
import { Building2, Plus, Users, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NewTicketForm } from "@/components/new-ticket-form";
import Link from "next/link";
import { Clock } from "lucide-react";
import { Eye } from "lucide-react";
import { useState, useEffect } from "react";
import { useDepartmentView } from "./hook";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type React from "react";
import { requestEventSchema } from "./types";
import type { EventFormData, UpcomingEvent,User,Ticket ,Team,Event,Department,Member} from "./types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Filter } from "lucide-react";
import { Edit} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { MapPin,  } from "lucide-react";
// The main data structure for the department page.
// The API should return an object with this shape.
interface DepartmentViewProps {
  departmentData: Department;
}

/**
 * The main client component for the department page.
 * It fetches data on the server and passes it to this component.
 * This component then uses hooks to manage state and renders the UI.
 *
 * @param departmentData - The data for the department, fetched on the server.
 *                         The API endpoint should return a `Department` object.
 */
export function DepartmentView({ departmentData }: DepartmentViewProps) {
  // The useDepartmentView hook encapsulates the client-side logic for the page.
  const hookProps = useDepartmentView({
    tickets: departmentData.tickets,
    initialEvents: departmentData.events,
    departmentId: departmentData.id,
  });

  return (
    <div className="space-y-6">
      {/* The header component displays the department\'s name, description, and managers. */}
      <DepartmentHeader
        department={departmentData}
        showNewTicket={hookProps.showNewTicket}
        onOpenChange={hookProps.setShowNewTicket}
        showEditDepartment={hookProps.showEditDepartment}
        onEditOpenChange={hookProps.setShowEditDepartment}
        showDeleteAlert={hookProps.showDeleteAlert}
        onDeleteOpenChange={hookProps.setShowDeleteAlert}
        onUpdate={hookProps.handleUpdateDepartment}
        onDelete={hookProps.handleDeleteDepartment}
      />

      <Tabs defaultValue="tickets" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tickets">Long-term Tickets</TabsTrigger>
          <TabsTrigger value="calendar">Department Calendar</TabsTrigger>
          <AuthorizedComponent departmentId={departmentData.id} action="manage">
            <TabsTrigger value="teams">Supervised Teams</TabsTrigger>
          </AuthorizedComponent>
          <TabsTrigger value="members">Members</TabsTrigger>
        </TabsList>

        {/* The TicketsTab component displays a list of tickets for the department. */}
        <TabsContent value="tickets">
          <TicketsTab
            tickets={departmentData.tickets}
            departmentId={departmentData.id}
          />
        </TabsContent>

        {/* The CalendarTab component displays the department's calendar and events. */}
        {/* It receives all the props from the useDepartmentView hook. */}
        <TabsContent value="calendar">
          <CalendarTab {...hookProps} departmentId={departmentData.id} />
        </TabsContent>

        {/* The TeamsTab component displays a list of teams in the department. */}
        <AuthorizedComponent departmentId={departmentData.id} action="manage">
          <TabsContent value="teams">
            <TeamsTab teams={departmentData.teams} />
          </TabsContent>
        </AuthorizedComponent>

        {/* The MembersTab component displays a list of members in the department. */}
        <TabsContent value="members">
          <MembersTab members={departmentData.members} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface DepartmentHeaderProps {
  department: Department;
  showNewTicket: boolean;
  onOpenChange: (open: boolean) => void;
  showEditDepartment: boolean;
  onEditOpenChange: (open: boolean) => void;
  showDeleteAlert: boolean;
  onDeleteOpenChange: (open: boolean) => void;
  onUpdate: (data: { name: string; description: string; color?: string; status?: string }) => Promise<void>;
  onDelete: () => Promise<void>;
}

export function DepartmentHeader({
  department,
  showNewTicket,
  onOpenChange,
  showEditDepartment,
  onEditOpenChange,
  showDeleteAlert,
  onDeleteOpenChange,
  onUpdate,
  onDelete,
}: DepartmentHeaderProps) {
  const availableWorkspaces = [
    { id: department.id, name: department.name, type: "department" as const },
    ...department.teams.map((team) => ({
      id: team.id,
      name: team.name,
      type: "team" as const,
    })),
  ];

  const formatManagers = (managers: User[]) => {
    if (!managers || managers.length === 0) {
      return null;
    }
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Users className="h-4 w-4" />
        <span>Managed by:</span>
        <span className="font-medium text-foreground">{managers[0].name}</span>
        {managers.length > 1 && (
          <span className="text-xs text-muted-foreground">
            +{managers.length - 1} more
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Building2 className="h-6 w-6 text-red-500" />
          {department.name}
        </h1>
        <p className="text-muted-foreground">{department.description}</p>
        {formatManagers(department.managers)}
      </div>
      <AuthorizedComponent
        departmentId={department.id}
        action="manage"
        requiresManager={true}
        requiresAdmin={true}
      >
        <div className="flex gap-2">
          <Dialog open={showNewTicket} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
              <Button className="bg-red-800 text-white hover:bg-red-700">
                <Plus className="mr-2 h-4 w-4" />
                New Initiative
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Department Initiative</DialogTitle>
                <DialogDescription>
                  Create a new long-term initiative for {department.name}
                </DialogDescription>
              </DialogHeader>
              <NewTicketForm
                contextType="department"
                contextId={department.id}
                availableWorkspaces={availableWorkspaces}
                availableUsers={department.members}
              />
            </DialogContent>
          </Dialog>

          <Button variant="outline" onClick={() => onEditOpenChange(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>

          <Button
            variant="destructive"
            onClick={() => onDeleteOpenChange(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </AuthorizedComponent>

      <EditDepartmentDialog
        department={department}
        open={showEditDepartment}
        onOpenChange={onEditOpenChange}
        onUpdate={onUpdate}
      />

      <AlertDialog open={showDeleteAlert} onOpenChange={onDeleteOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              department and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => onDelete()}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

interface TicketsTabProps {
  tickets: Ticket[];
  departmentId: string;
}

export function TicketsTab({ tickets, departmentId }: TicketsTabProps) {
  return (
    <div className="grid gap-4">
      {tickets.map((ticket) => (
        <Link
          key={ticket.id}
          href={`/tickets/${ticket.id}?from=/departments/${departmentId}`}
        >
          <Card className="hover:bg-accent/50 transition-colors cursor-pointer p-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-medium">{ticket.title}</h3>
                    <Badge variant="outline">{ticket.priority}</Badge>
                    <Badge
                      variant={
                        ticket.status === "in_progress"
                          ? "secondary"
                          : ticket.status === "open"
                          ? "outline"
                          : "default"
                      }
                    >
                      {ticket.status.replace("_", " ")}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                    {ticket.assignee && (
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        Assigned to: {ticket.assignee.name}
                      </span>
                    )}
                    {ticket.reporter && (
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        Reporter: {ticket.reporter.name}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Created: {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                    {ticket.dueDate && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Due: {new Date(ticket.dueDate).toLocaleDateString()}
                      </span>
                    )}
                    <span>
                      Last updated:{" "}
                      {new Date(ticket.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  {ticket.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                      {ticket.description}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

interface TeamsTabProps {
  teams: Team[];
}

export function TeamsTab({ teams }: TeamsTabProps) {
  const formatLeaders = (leaders: User[]) => {
    if (!leaders || leaders.length === 0) {
      return null;
    }
    return (
      <div className="flex items-center gap-2 text-sm">
        <Avatar className="h-6 w-6">
          <AvatarImage src={leaders[0].avatar} alt={leaders[0].name} />
          <AvatarFallback className="text-xs">
            {leaders[0].name
              .split(" ")
              .map((n: string) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <span className="text-muted-foreground">
          Led by{" "}
          <span className="font-medium text-foreground">{leaders[0].name}</span>
          {leaders.length > 1 && ` +${leaders.length - 1} more`}
        </span>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Supervised Teams</CardTitle>
        <CardDescription>
          Teams under this department&apos;s oversight
        </CardDescription>
      </CardHeader>
      <CardContent>
        {teams.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No teams found in this department</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {teams.map((team) => (
              <Card
                key={team.id}
                className="hover:bg-accent/50 transition-colors"
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{team.name}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <Users className="h-3 w-3" />
                          {team.memberCount} members
                        </p>
                      </div>
                      <Badge variant="default" className="shrink-0">
                        Active
                      </Badge>
                    </div>
                    {formatLeaders(team.leaders)}
                    {team.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {team.description}
                      </p>
                    )}
                    <div className="pt-2">
                      <Link href={`/teams/${team.id}`}>
                        <Button size="sm" variant="outline" className="w-full">
                          <Eye className="mr-2 h-3 w-3" />
                          View Team
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface MembersTabProps {
  members: Member[];
}

export function MembersTab({ members }: MembersTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Department Members</CardTitle>
        <CardDescription>All members of this department.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="font-medium">{member.name}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{member.role}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

interface CalendarTabProps {
  calendarView: "month" | "week" | "day";
  currentDate: Date;
  events: Event[];
  departmentId: string;
  upcomingEvents: UpcomingEvent[];
  filterType: string;
  selectedEvent: Event | null;
  isCalendarLoading: boolean;
  showNewEventDialog: boolean;
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
  createEvent: (
    data: EventFormData & { id?: number | string }
  ) => Promise<boolean>;
  handleEditEvent: (event: Event) => void;
  handleDeleteEvent: (event: Event) => void;
  setShowNewEventDialog: (show: boolean) => void;
  setSelectedEvent: (event: Event | null) => void;
}

export function CalendarTab({
  calendarView,
  currentDate,
  events,
  departmentId,
  upcomingEvents,
  filterType,
  selectedEvent,
  isCalendarLoading,
  showNewEventDialog,
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
  createEvent,
  handleEditEvent,
  handleDeleteEvent,
  setShowNewEventDialog,
  setSelectedEvent,
}: CalendarTabProps) {
  return (
    <>
      <div className="grid gap-6 lg:grid-cols-4">
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

        <CalendarSidebar
          upcomingEvents={upcomingEvents}
          allEvents={events}
          filterType={filterType}
          departmentId={departmentId}
          onFilterChange={onFilterChange}
          onNewEventClick={onNewEventClick}
          onEventClick={onSetSelectedEvent}
        />
      </div>
      <AuthorizedComponent
        departmentId={departmentId}
        action="manage"
        requiresManager={true}
      >
        <RequestEventDialog
          isOpen={showNewEventDialog}
          onClose={() => setShowNewEventDialog(false)}
          onSubmit={createEvent}
          isLoading={isCalendarLoading}
          initialData={selectedEvent}
        />
      </AuthorizedComponent>
      <EventDetailsDialog
        departmentId={departmentId}
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
      />
    </>
  );
}

interface EditDepartmentDialogProps {
  department: Department;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (data: { name: string; description: string; color?: string; status?: string }) => Promise<void>;
}

export function EditDepartmentDialog({
  department,
  open,
  onOpenChange,
  onUpdate,
}: EditDepartmentDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "",
    status: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (department) {
      setFormData({
        name: department.name || "",
        description: department.description || "",
        color: department.color || "",
        status: department.status || "",
      });
    }
  }, [department]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    await onUpdate(formData);
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Department</DialogTitle>
          <DialogDescription>
            Update the details for {department.name}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Department Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className={cn(errors.name && "border-red-500")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>
          {/* Add fields for color and status if needed */}
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


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

export function CalendarView({ currentDate, view, events, setSelectedEvent, handleDayClick, getDaysInMonth, getFirstDayOfMonth, formatDateString }: CalendarViewProps) {
  const getEventsForDate = (date: string) => {
    return events.filter((event) => event.date.split("T")[0] === date);
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

interface CalendarSidebarProps {
  upcomingEvents: UpcomingEvent[];
  allEvents: Event[];
  departmentId: string;
  filterType: string;
  onFilterChange: (type: string) => void;
  onNewEventClick: () => void;
  onEventClick: (event: Event | null) => void;
}

export function CalendarSidebar({ upcomingEvents, allEvents, filterType,departmentId, onFilterChange, onNewEventClick, onEventClick }: CalendarSidebarProps) {
  const eventTypes = ["all", ...Array.from(new Set(allEvents.map(e => e.type)))];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
        <CardContent className="space-y-2">
      <AuthorizedComponent departmentId={departmentId} action="manage" requiresManager={true} >
            <Button variant="outline" className="w-full justify-start bg-transparent" onClick={onNewEventClick}>
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        </AuthorizedComponent>
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
          {upcomingEvents.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No upcoming events
            </p>
          ) : (
            upcomingEvents.map((event) => (
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
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}






interface RequestEventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EventFormData & { id?: number | string }) => Promise<boolean>;
  isLoading: boolean;
  initialData?: Event | null;
}

export function RequestEventDialog({ isOpen, onClose, onSubmit, isLoading, initialData }: RequestEventDialogProps) {
  const isEditMode = !!initialData;

  const form = useForm<EventFormData>({
    resolver: zodResolver(requestEventSchema),
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
          type: initialData.type,
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
          <DialogTitle>
            {isEditMode ? "Edit Event" : "Request time for a New Event"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the details for this event."
              : "Request access for a club's time slot for an event"}
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
                      <Input type="time" {...field} />
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
                {isEditMode ? "Save Changes" : "Request Event"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

interface EventDetailsDialogProps {
  event: Event | null;
  departmentId: string;
  onClose: () => void;
  onEdit: (event: Event) => void;
  onDelete: (event: Event) => void;
}

export function EventDetailsDialog({ event, onClose,departmentId, onEdit, onDelete }: EventDetailsDialogProps) {
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
        <AuthorizedComponent departmentId={departmentId} action="manage" requiresManager={true} >

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
        </AuthorizedComponent>
      </DialogContent>
    </Dialog>
  );
}


