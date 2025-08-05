// hook.ts

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export function useTeamDetailPage() {
  const { toast } = useToast()
  const params = useParams()
  const teamId = params.teamId as string

  const [loading, setLoading] = useState(true)
  const [team, setTeam] = useState<ReturnType<typeof getMockTeam> | null>(null)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [showNewTicket, setShowNewTicket] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setTeam(getMockTeam(teamId))
      setLoading(false)
    }, 1000)
  }, [teamId])

  const tickets = getMockTickets()

  const selectedDateTickets = tickets.filter(
    (ticket) => date && ticket.calendarDate.toDateString() === date.toDateString(),
  )

  const calendarEvents = tickets.reduce((acc, ticket) => {
    const dateKey = ticket.calendarDate.toDateString()
    if (!acc[dateKey]) acc[dateKey] = []
    acc[dateKey].push(ticket)
    return acc
  }, {} as Record<string, typeof tickets>)

  const handleMemberAction = (action: string, memberId: string) => {
    const member = team?.members.find((m) => m.id === memberId)
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

  return {
    teamId,
    loading,
    team,
    date,
    setDate,
    showNewTicket,
    setShowNewTicket,
    tickets,
    selectedDateTickets,
    calendarEvents,
    handleMemberAction,
    handleInviteMember,
  }
}

// === Mock Data ===

function getMockTeam(teamId: string) {
  return {
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
}

function getMockTickets() {
  return [
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
}
