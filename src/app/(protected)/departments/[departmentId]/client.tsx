// client.tsx

"use client";

import Link from "next/link";
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  MessageSquare,
  MoreVertical,
  Plus,
  Settings,
  UserPlus,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NewTicketForm } from "@/components/new-ticket-form";
import { useDepartmentView } from "./hook";
import { Department } from "./types"; // Import the shared Department type

interface DepartmentViewProps {
  departmentData: Department; // Use the imported type
}

/**
 * A client component that renders the interactive details of a department.
 * @param {DepartmentViewProps} props - The department data fetched from the server.
 */
export function DepartmentView({ departmentData }: DepartmentViewProps) {
  // Use the custom hook to get state and event handlers
  const {
    date,
    setDate,
    showNewTicket,
    setShowNewTicket,
    department,
    tickets,
    selectedDateTickets,
    calendarEvents,
    handleTeamAction,
    handleLeaderAction,
    goToPreviousDay,
    goToNextDay,
  } = useDepartmentView({
    departmentId: departmentData.id,
    departmentName: departmentData.name,
    derpartmentDescription: departmentData.description,
  });

  return (
    <div className="space-y-6">
      {/* Department Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Building2 className="h-6 w-6 text-red-500" />
            {department.name}
          </h1>
          <p className="text-muted-foreground">{department.description}</p>
        </div>
        <Dialog open={showNewTicket} onOpenChange={setShowNewTicket}>
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
            <NewTicketForm />
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="tickets" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tickets">Long-term Tickets</TabsTrigger>
          <TabsTrigger value="calendar">Department Calendar</TabsTrigger>
          <TabsTrigger value="teams">Supervised Teams</TabsTrigger>
          <TabsTrigger value="leaders">Leadership</TabsTrigger>
        </TabsList>

        {/* Tickets Tab */}
        <TabsContent value="tickets" className="space-y-4">
          <div className="grid gap-4">
            {tickets.map((ticket) => (
              <Link key={ticket.id} href={`/tickets/${ticket.id}`}>
                <Card className="hover:bg-accent/50 transition-colors cursor-pointer p-0">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-medium">{ticket.title}</h3>
                          <Badge variant="outline" className="text-xs">
                            {ticket.type}
                          </Badge>
                          {ticket.collaborative && (
                            <Badge variant="secondary" className="text-xs">
                              Collaborative
                            </Badge>
                          )}
                          <Badge
                            variant={
                              ticket.status === "in_progress"
                                ? "secondary"
                                : ticket.status === "scheduled"
                                ? "outline"
                                : "destructive"
                            }
                            className="text-xs"
                          >
                            {ticket.status.replace("_", " ")}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                          {ticket.assignee && (
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {ticket.assignee}
                            </span>
                          )}
                          {ticket.collaborative &&
                            ticket.collaborators.length > 0 && (
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {ticket.collaborators.join(", ")}
                              </span>
                            )}
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Duration: {ticket.duration}
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
          </div>
        </TabsContent>

        {/* Calendar Tab */}
        <TabsContent value="calendar" className="space-y-4">
          <div className="grid gap-4 lg:gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Calendar</CardTitle>
                <CardDescription className="text-sm">
                  Select a date to view milestones
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border w-full"
                  modifiers={{
                    hasEvents: (d) => calendarEvents[d.toDateString()]?.length > 0,
                  }}
                  modifiersStyles={{
                    hasEvents: {
                      backgroundColor: "rgb(220 38 38 / 0.1)",
                      color: "rgb(220 38 38)",
                      fontWeight: "bold",
                    },
                  }}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center ">
                <div className="flex-1">
                  <CardTitle className="text-lg sm:text-xl">
                    {date
                      ? `Milestones for ${date.toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}`
                      : "Select a date"}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {selectedDateTickets.length > 0
                      ? `${selectedDateTickets.length} milestone${selectedDateTickets.length > 1 ? "s" : ""} scheduled`
                      : "No milestones scheduled for this date"}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2 mt-4 sm:mt-0">
                  <Button variant="outline" size="icon" onClick={goToPreviousDay} className="h-8 w-8">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={goToNextDay} className="h-8 w-8">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                {selectedDateTickets.length === 0 ? (
                  <div className="flex h-[200px] sm:h-[300px] items-center justify-center border rounded-md">
                    <p className="text-sm text-muted-foreground">
                      No milestones scheduled for this date
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4 max-h-[300px] overflow-auto">
                    {selectedDateTickets.map((ticket) => (
                      <Link key={ticket.id} href={`/tickets/${ticket.id}`}>
                        <div className="border rounded-lg p-3 sm:p-4 hover:bg-accent/50 transition-colors cursor-pointer">
                          <h3 className="font-semibold text-sm sm:text-base mb-2">{ticket.title}</h3>
                          <div className="text-xs sm:text-sm text-muted-foreground">
                            Duration: {ticket.duration}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Teams Tab */}
        <TabsContent value="teams" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Supervised Teams</CardTitle>
              <CardDescription>
                Teams under this department's oversight
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {department.teams.map((team) => (
                  <Card key={team.id} className="hover:bg-accent/50 transition-colors p-0">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-medium">{team.name}</h3>
                          <p className="text-sm text-muted-foreground">{team.memberCount} members</p>
                        </div>
                        <Badge variant={team.status === "active" ? "default" : "secondary"}>
                          {team.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link href={`/teams/${team.id}`}>
                          <Button size="sm" variant="outline">
                            <Eye className="mr-1 h-3 w-3" /> View
                          </Button>
                        </Link>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="ghost">
                              <MoreVertical className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleTeamAction("Edit", team.id)}>
                              <Settings className="mr-2 h-4 w-4" /> Edit Team
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleTeamAction("Add Member", team.id)}>
                              <UserPlus className="mr-2 h-4 w-4" /> Add Member
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Leaders Tab */}
        <TabsContent value="leaders" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Department Leadership</CardTitle>
                  <CardDescription>
                    Leaders who can collaborate on department tickets
                  </CardDescription>
                </div>
                <Button onClick={() => handleLeaderAction("Invite Leader", "")} variant="outline">
                  <UserPlus className="mr-2 h-4 w-4" /> Add Leader
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {department.leaders.map((leader) => (
                  <div key={leader.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={leader.avatar || "/placeholder.svg"} alt={leader.name} />
                        <AvatarFallback>{leader.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{leader.name}</div>
                        <div className="text-sm text-muted-foreground">{leader.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={leader.role === "super_leader" ? "destructive" : "default"}>
                        {leader.role.replace("_", " ")}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleLeaderAction("Edit Role", leader.id)}>
                            <Settings className="mr-2 h-4 w-4" /> Change Role
                          </DropdownMenuItem>
                          {leader.role !== "super_leader" && (
                            <DropdownMenuItem onClick={() => handleLeaderAction("Remove", leader.id)} className="text-destructive">
                              Remove Leader
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
