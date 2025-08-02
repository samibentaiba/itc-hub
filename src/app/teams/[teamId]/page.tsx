"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function TeamDetailPage() {
  const params = useParams()
  const teamId = params.teamId as string
  const [loading, setLoading] = useState(true)
  const [team, setTeam] = useState<{
    id: string;
    name: string;
    description: string;
    department: string;
    memberCount: number;
    activeProjects: number;
    lead: {
      name: string;
      avatar: string;
      id: string;
    };
    status: string;
    createdAt: string;
  } | null>(null)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      // Mock team data based on teamId
      const mockTeam = {
        id: teamId,
        name: teamId === "team-1" ? "Frontend Team" : teamId === "team-2" ? "Backend Team" : "Design Team",
        description:
          teamId === "team-1"
            ? "Responsible for user interface development and user experience"
            : teamId === "team-2"
              ? "Server-side development and API management"
              : "User experience and visual design",
        department: teamId === "team-1" || teamId === "team-2" ? "Engineering" : "Design",
        memberCount: teamId === "team-1" ? 8 : teamId === "team-2" ? 6 : 5,
        activeProjects: teamId === "team-1" ? 5 : teamId === "team-2" ? 3 : 4,
        lead: {
          name: teamId === "team-1" ? "Sami Al-Rashid" : teamId === "team-2" ? "Ali Mohammed" : "Yasmine Hassan",
          avatar: "/placeholder.svg?height=32&width=32",
          id: teamId === "team-1" ? "sami" : teamId === "team-2" ? "ali" : "yasmine",
        },
        status: "active",
        createdAt: "2023-01-15",
      }
      setTeam(mockTeam)
      setLoading(false)
    }, 1000)
  }, [teamId])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/teams">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Teams
            </Button>
          </Link>
        </div>
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-muted rounded w-1/2 mb-8"></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!team) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/teams">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Teams
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <h3 className="text-lg font-semibold">Team not found</h3>
              <p className="text-muted-foreground">The team you&apos;re looking for doesn&apos;t exist.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/teams">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Teams
            </Button>
          </Link>

        </div>

      </div>

      {/* Team Details */}
      <TeamView teamId={team.id} teamDescription={team.description} teamName={team.name} />
    </div>
  )
}



import {  CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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
import { Clock, MessageSquare, Plus, Users, MoreVertical, UserPlus, Settings, Mail, ChevronLeft, ChevronRight } from "lucide-react"
import { NewTicketForm } from "@/components/new-ticket-form"
import { useToast } from "@/hooks/use-toast"

interface TeamViewProps {
  teamId: string
  teamName: string
  teamDescription: string
}

export function TeamView({ teamId, teamName, teamDescription }: TeamViewProps) {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [showNewTicket, setShowNewTicket] = useState(false)
  const { toast } = useToast()

  // Mock team data
  const team = {
    id: teamId,
    name: teamName,
    description: teamDescription,
    members: [
      {
        id: "u1",
        name: "Sami",
        role: "leader",
        avatar: "/placeholder.svg?height=32&width=32",
        status: "online",
        email: "sami@itc.com",
        joinedDate: "2024-01-15",
      },
      {
        id: "u2",
        name: "Ali",
        role: "member",
        avatar: "/placeholder.svg?height=32&width=32",
        status: "away",
        email: "ali@itc.com",
        joinedDate: "2024-02-01",
      },
      {
        id: "u3",
        name: "Sara",
        role: "member",
        avatar: "/placeholder.svg?height=32&width=32",
        status: "offline",
        email: "sara@itc.com",
        joinedDate: "2024-02-15",
      },
    ],
  }

  const tickets = [
    {
      id: "t1",
      title: "Implement dark mode toggle",
      type: "task",
      status: "in_progress",
      assignee: "Ali",
      dueDate: "2025-01-25",
      messages: 5,
      lastActivity: "2 hours ago",
      calendarDate: new Date("2025-01-25"),
    },
    {
      id: "t2",
      title: "Weekly team standup",
      type: "meeting",
      status: "scheduled",
      assignee: null,
      dueDate: "2025-01-24",
      messages: 1,
      lastActivity: "1 day ago",
      calendarDate: new Date("2025-01-24"),
    },
    {
      id: "t3",
      title: "Code review session",
      type: "event",
      status: "pending",
      assignee: "Sara",
      dueDate: "2025-01-26",
      messages: 3,
      lastActivity: "3 hours ago",
      calendarDate: new Date("2025-01-26"),
    },
    {
      id: "t4",
      title: "Sprint planning",
      type: "meeting",
      status: "scheduled",
      assignee: null,
      dueDate: "2025-01-27",
      messages: 0,
      lastActivity: "Just created",
      calendarDate: new Date("2025-01-27"),
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

  const handleMemberAction = (action: string, memberId: string) => {
    const member = team.members.find((m) => m.id === memberId)
    toast({
      title: `${action} ${member?.name}`,
      description: `Action "${action}" performed on ${member?.name}`,
    })
  }

  const handleInviteMember = () => {
    toast({
      title: "Invitation sent",
      description: "Team invitation has been sent successfully.",
    })
  }

  return (
    <div className="space-y-6">
      {/* Team Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{team.name}</h1>
          <p className="text-muted-foreground">{team.description}</p>
        </div>
        <Dialog open={showNewTicket} onOpenChange={setShowNewTicket}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="mr-2 h-4 w-4" />
              New Ticket
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Team Ticket</DialogTitle>
              <DialogDescription>Create a new ticket for {team.name}</DialogDescription>
            </DialogHeader>
            <NewTicketForm />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="tickets" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tickets">Tickets</TabsTrigger>
          <TabsTrigger value="calendar">Team Calendar</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
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
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Due {ticket.dueDate}
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
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Calendar</CardTitle>
                <CardDescription className="text-sm">Select a date to view events</CardDescription>
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
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center">
                <div className="flex-1">
                  <CardTitle className="text-lg sm:text-xl">
                    {date
                      ? `Events for ${date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`
                      : "Select a date"}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {selectedDateTickets.length === 0
                      ? "No events scheduled for this date"
                      : `${selectedDateTickets.length} event${selectedDateTickets.length > 1 ? "s" : ""} scheduled`}
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
                    <p className="text-sm text-muted-foreground">No events scheduled for this date</p>
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
                          <div className="text-xs sm:text-sm text-muted-foreground mb-3">
                            {ticket.assignee ? `Assigned to ${ticket.assignee}` : "No assignee"} • {ticket.messages} messages
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {ticket.lastActivity}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Due {ticket.dueDate}
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

        <TabsContent value="members" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>Current team composition and roles</CardDescription>
                </div>
                <Button onClick={handleInviteMember} variant="outline">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Invite Member
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {team.members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div
                          className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-background ${member.status === "online"
                              ? "bg-green-500"
                              : member.status === "away"
                                ? "bg-yellow-500"
                                : "bg-gray-500"
                            }`}
                        />
                      </div>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-muted-foreground">{member.email}</div>
                        <div className="text-xs text-muted-foreground">Joined {member.joinedDate}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={member.role === "leader" ? "default" : "secondary"}>{member.role}</Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleMemberAction("Message", member.id)}>
                            <Mail className="mr-2 h-4 w-4" />
                            Send Message
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleMemberAction("Edit Role", member.id)}>
                            <Settings className="mr-2 h-4 w-4" />
                            Change Role
                          </DropdownMenuItem>
                          {member.role !== "leader" && (
                            <DropdownMenuItem
                              onClick={() => handleMemberAction("Remove", member.id)}
                              className="text-destructive"
                            >
                              Remove from Team
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

