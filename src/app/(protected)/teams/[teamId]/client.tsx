// src/app/(protected)/teams/[teamId]/client.tsx
"use client";

import { useTeamDetailPage } from "./hook";
import { useAuthorization, AuthorizedComponent } from "@/hooks/use-authorization";
import type { TeamDetail, TeamTicket, TeamMember } from "./types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NewTicketForm } from "@/components/new-ticket-form";
import {
  Clock,
  MessageSquare,
  Users,
  Plus,
  Mail,
  Settings,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  ArrowLeft,
  Calendar as CalendarIcon,
} from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import CalendarView from "./_components/calendar/calendar-view";
import RequestEventDialog from "./_components/calendar/request-event-dialog";
import EventDetailsDialog from "./_components/calendar/event-details-dialog";
import CalendarSidebar from "./_components/calendar/calendar-sidebar";

interface TeamDetailClientPageProps {
  initialTeam: TeamDetail;
  initialTickets: TeamTicket[];
}

export default function TeamDetailClientPage({
  initialTeam,
  initialTickets,
}: TeamDetailClientPageProps) {
  const {
    team,
    tickets,
    showNewTicket,
    setShowNewTicket,
    handleInviteMember,
    handleMemberAction,
    calendarView,
    currentDate,
    events,
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
  } = useTeamDetailPage(initialTeam, initialTickets);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Link href="/teams">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Teams
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{team.name}</h1>
            <p className="text-muted-foreground">{team.description}</p>
          </div>
        </div>
        <AuthorizedComponent teamId={team.id} action="manage">
          <Dialog open={showNewTicket} onOpenChange={setShowNewTicket}>
            <DialogTrigger asChild>
              <Button className="bg-red-800 text-white hover:bg-red-700">
                <Plus className="mr-2 h-4 w-4" />
                New Ticket
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Team Ticket</DialogTitle>
                <DialogDescription>
                  Create a new ticket for {team.name}
                </DialogDescription>
              </DialogHeader>
              <NewTicketForm
                contextType="team"
                contextId={team.id}
                availableUsers={team.members}
              />
            </DialogContent>
          </Dialog>
        </AuthorizedComponent>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="tickets" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tickets">Tickets</TabsTrigger>
          <TabsTrigger value="calendar">Team Calendar</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
        </TabsList>

        {/* Tickets Tab */}
        <TabsContent value="tickets" className="space-y-4">
          <div className="grid gap-4">
            {tickets.map((ticket) => (
              <Link key={ticket.id} href={`/tickets/${ticket.id}?from=/teams/${team.id}`}>
                <Card className="hover:bg-accent/50 transition-colors cursor-pointer p-0">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{ticket.title}</h3>
                          <Badge variant="outline" className="text-xs">
                            {ticket.type}
                          </Badge>
                          <Badge
                            variant={
                              ticket.status === "verified"
                                ? "default"
                                : ticket.status === "in_progress"
                                ? "secondary"
                                : "destructive"
                            }
                            className="text-xs"
                          >
                            {ticket.status.replace("_", " ")}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          {ticket.assignee && (
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {ticket.assignee}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Due {new Date(ticket.dueDate).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            {ticket.messages} messages
                          </span>
                          <span>Last activity: {ticket.lastActivity}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
            {tickets.length === 0 && (
              <p className="text-muted-foreground text-center py-8">
                No tickets found for this team.
              </p>
            )}
          </div>
        </TabsContent>

        {/* Calendar Tab */}
        <TabsContent value="calendar">
          <div className="grid gap-6 lg:grid-cols-4">
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                      <CalendarIcon className="h-5 w-5" />
                      {formatDate(currentDate)}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Select
                        value={calendarView}
                        onValueChange={(v) => onSetCalendarView(v)}
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
              onFilterChange={onFilterChange}
              onNewEventClick={onNewEventClick}
              onEventClick={onSetSelectedEvent}
            />
          </div>
        </TabsContent>

        {/* Members Tab */}
        <TabsContent value="members" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>
                    Current team composition and roles
                  </CardDescription>
                </div>
              
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {team.members && team.members.map((member) => {
                  // Safety check for member data
                  if (!member || !member.name) {
                    return null;
                  }
                  
                  return (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={member.avatar || ""} alt={member.name} />
                            <AvatarFallback>
                              {member.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div
                            className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-background ${
                              member.status === "online"
                                ? "bg-green-500"
                                : member.status === "away"
                                ? "bg-yellow-500"
                                : "bg-gray-500"
                            }`}
                          />
                        </div>
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {member.email || "No email"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Joined{" "}
                            {member.joinedDate ? new Date(member.joinedDate).toLocaleDateString() : "Unknown"}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            member.role === "leader" ? "default" : "secondary"
                          }
                        >
                          {member.role || "member"}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                handleMemberAction("Message", member)
                              }
                            >
                              <Mail className="mr-2 h-4 w-4" />
                              Send Message
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  );
                })}
                {(!team.members || team.members.length === 0) && (
                  <p className="text-muted-foreground text-center py-8">
                    No members found for this team.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <RequestEventDialog
        isOpen={showNewEventDialog}
        onClose={() => setShowNewEventDialog(false)}
        onSubmit={createEvent}
        isLoading={isCalendarLoading}
        initialData={selectedEvent}
      />
      <EventDetailsDialog
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
      />
    </div>
  );
}