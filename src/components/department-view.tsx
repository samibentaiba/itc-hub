"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar } from "@/components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import {
  Clock,
  MessageSquare,
  Plus,
  Users,
  CalendarIcon,
  Building2,
  MoreVertical,
  Settings,
  UserPlus,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { NewTicketForm } from "./new-ticket-form"
import { useToast } from "@/hooks/use-toast"

interface DepartmentViewProps {
  departmentId: string
  departmentName: string
  derpartmentDescription: string
}

export function DepartmentView({ departmentId, departmentName, derpartmentDescription }: DepartmentViewProps) {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [showNewTicket, setShowNewTicket] = useState(false)
  const { toast } = useToast()

  // Mock department data
  const department = {
    id: departmentId,
    name: departmentName,
    description: derpartmentDescription,
    leaders: [
      {
        id: "u1",
        name: "Sami",
        role: "super_leader",
        avatar: "/placeholder.svg?height=32&width=32",
        status: "online",
        email: "sami@itc.com",
        joinedDate: "2024-01-01",
      },
      {
        id: "u2",
        name: "Yasmine",
        role: "leader",
        avatar: "/placeholder.svg?height=32&width=32",
        status: "online",
        email: "yasmine@itc.com",
        joinedDate: "2024-01-15",
      },
    ],
    teams: [
      { id: "team-1", name: "Frontend Team", memberCount: 5, leader: "Ali", status: "active" },
      { id: "team-2", name: "Backend Team", memberCount: 4, leader: "Omar", status: "active" },
      { id: "team-3", name: "Mobile Team", memberCount: 3, leader: "Layla", status: "planning" },
    ],
  }

  const tickets = [
    {
      id: "t1",
      title: "Q1 Architecture Review",
      type: "meeting",
      status: "in_progress",
      assignee: null,
      duration: "2 months",
      messages: 12,
      lastActivity: "1 hour ago",
      collaborative: true,
      calendarDate: new Date("2025-01-25"),
      collaborators: ["Sami", "Yasmine"],
    },
    {
      id: "t2",
      title: "Tech Stack Migration Plan",
      type: "task",
      status: "pending",
      assignee: "Yasmine",
      duration: "6 months",
      messages: 8,
      lastActivity: "2 days ago",
      collaborative: false,
      calendarDate: new Date("2025-01-30"),
      collaborators: [],
    },
    {
      id: "t3",
      title: "Annual Development Conference",
      type: "event",
      status: "scheduled",
      assignee: null,
      duration: "1 year",
      messages: 25,
      lastActivity: "5 hours ago",
      collaborative: true,
      calendarDate: new Date("2025-01-28"),
      collaborators: ["Sami", "Yasmine"],
    },
    {
      id: "t4",
      title: "Security Audit Planning",
      type: "meeting",
      status: "scheduled",
      assignee: "Sami",
      duration: "3 months",
      messages: 3,
      lastActivity: "1 day ago",
      collaborative: true,
      calendarDate: new Date("2025-01-26"),
      collaborators: ["Sami"],
    },
  ]

  // Get tickets for selected date
  const selectedDateTickets = tickets.filter(
    (ticket) => date && ticket.calendarDate.toDateString() === date.toDateString(),
  )

  // Get calendar events (tickets) for the calendar component
  const calendarEvents = tickets.reduce(
    (acc, ticket) => {
      const dateKey = ticket.calendarDate.toDateString()
      if (!acc[dateKey]) acc[dateKey] = []
      acc[dateKey].push(ticket)
      return acc
    },
    {} as Record<string, typeof tickets>,
  )

  const handleTeamAction = (action: string, teamId: string) => {
    const team = department.teams.find((t) => t.id === teamId)
    toast({
      title: `${action} ${team?.name}`,
      description: `Action "${action}" performed on ${team?.name}`,
    })
  }

  const handleLeaderAction = (action: string, leaderId: string) => {
    const leader = department.leaders.find((l) => l.id === leaderId)
    toast({
      title: `${action} ${leader?.name}`,
      description: `Action "${action}" performed on ${leader?.name}`,
    })
  }

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
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="mr-2 h-4 w-4" />
              New Initiative
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Department Initiative</DialogTitle>
              <DialogDescription>Create a new long-term initiative for {department.name}</DialogDescription>
            </DialogHeader>
            <NewTicketForm />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="tickets" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tickets">Long-term Tickets</TabsTrigger>
          <TabsTrigger value="calendar">Department Calendar</TabsTrigger>
          <TabsTrigger value="teams">Supervised Teams</TabsTrigger>
          <TabsTrigger value="leaders">Leadership</TabsTrigger>
        </TabsList>

        <TabsContent value="tickets" className="space-y-4">
          <div className="grid gap-4">
            {tickets.map((ticket) => (
              <Link key={ticket.id} href={`/tickets/${ticket.id}`}>
                <Card className="hover:bg-accent/50 transition-colors cursor-pointer p-0">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
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
                              ticket.status === "verified"
                                ? "default"
                                : ticket.status === "in_progress"
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
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          {ticket.assignee && (
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {ticket.assignee}
                            </span>
                          )}
                          {ticket.collaborative && ticket.collaborators.length > 0 && (
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

        <TabsContent value="calendar" className="space-y-4">
          <div className="grid gap-4 lg:gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader >
                <CardTitle className="text-lg sm:text-xl">Calendar</CardTitle>
                <CardDescription className="text-sm">Select a date to view milestones</CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border w-full"
                  modifiers={{
                    hasEvents: (date) => {
                      const dateKey = date.toDateString()
                      return !!calendarEvents[dateKey]
                    },
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
                      ? `Milestones for ${date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`
                      : "Select a date"}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {selectedDateTickets.length === 0
                      ? "No milestones scheduled for this date"
                      : `${selectedDateTickets.length} milestone${selectedDateTickets.length > 1 ? "s" : ""} scheduled`}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2 mt-4 sm:mt-0">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      if (date) {
                        const newDate = new Date(date)
                        newDate.setDate(newDate.getDate() - 1)
                        setDate(newDate)
                      }
                    }}
                    className="h-8 w-8"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      if (date) {
                        const newDate = new Date(date)
                        newDate.setDate(newDate.getDate() + 1)
                        setDate(newDate)
                      }
                    }}
                    className="h-8 w-8"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                {selectedDateTickets.length === 0 ? (
                  <div className="flex h-[200px] sm:h-[300px] items-center justify-center border rounded-md">
                    <p className="text-sm text-muted-foreground">No milestones scheduled for this date</p>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4 max-h-[300px] overflow-auto">
                    {selectedDateTickets.map((ticket) => (
                      <Link key={ticket.id} href={`/tickets/${ticket.id}`}>
                        <div className="border rounded-lg p-3 sm:p-4 hover:bg-accent/50 transition-colors cursor-pointer">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-2">
                            <h3 className="font-semibold text-sm sm:text-base">{ticket.title}</h3>
                            <Badge variant="outline" className="text-xs">{ticket.type}</Badge>
                          </div>
                          <div className="text-xs sm:text-sm text-muted-foreground mb-3">Duration: {ticket.duration} • {ticket.messages} messages</div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-muted-foreground">
                            {ticket.assignee && (
                              <div className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {ticket.assignee}
                              </div>
                            )}
                            {ticket.collaborative && ticket.collaborators.length > 0 && (
                              <div className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {ticket.collaborators.join(", ")}
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {ticket.lastActivity}
                            </div>
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

        <TabsContent value="teams" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Supervised Teams</CardTitle>
              <CardDescription>Teams under this department's oversight</CardDescription>
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
                          <p className="text-xs text-muted-foreground">Led by {team.leader}</p>
                        </div>
                        <Badge variant={team.status === "active" ? "default" : "secondary"}>{team.status}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link href={`/teams/${team.id}`}>
                          <Button size="sm" variant="outline">
                            <Eye className="mr-1 h-3 w-3" />
                            View
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
                              <Settings className="mr-2 h-4 w-4" />
                              Edit Team
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleTeamAction("Add Member", team.id)}>
                              <UserPlus className="mr-2 h-4 w-4" />
                              Add Member
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleTeamAction("View Reports", team.id)}>
                              View Reports
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

        <TabsContent value="leaders" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Department Leadership</CardTitle>
                  <CardDescription>Leaders who can collaborate on department tickets</CardDescription>
                </div>
                <Button onClick={() => handleLeaderAction("Invite Leader", "")} variant="outline">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Leader
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {department.leaders.map((leader) => (
                  <div key={leader.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={leader.avatar || "/placeholder.svg"} alt={leader.name} />
                          <AvatarFallback>{leader.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div
                          className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-background ${
                            leader.status === "online" ? "bg-green-500" : "bg-gray-500"
                          }`}
                        />
                      </div>
                      <div>
                        <div className="font-medium">{leader.name}</div>
                        <div className="text-sm text-muted-foreground">{leader.email}</div>
                        <div className="text-xs text-muted-foreground">Joined {leader.joinedDate}</div>
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
                          <DropdownMenuItem onClick={() => handleLeaderAction("Message", leader.id)}>
                            Send Message
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleLeaderAction("Edit Role", leader.id)}>
                            <Settings className="mr-2 h-4 w-4" />
                            Change Role
                          </DropdownMenuItem>
                          {leader.role !== "super_leader" && (
                            <DropdownMenuItem
                              onClick={() => handleLeaderAction("Remove", leader.id)}
                              className="text-destructive"
                            >
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
  )
}
