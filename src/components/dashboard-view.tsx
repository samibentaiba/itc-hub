"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
  Users,
  Building2,
  CheckCircle,
  AlertCircle,
  Plus,
  MoreVertical,
  TrendingUp,
  Activity,
  ExternalLink,
} from "lucide-react"
import { NewTicketForm } from "./new-ticket-form"
import { useToast } from "@/hooks/use-toast"

export function DashboardView() {
  const [showNewTicket, setShowNewTicket] = useState(false)
  const [selectedStatCard, setSelectedStatCard] = useState<string | null>(null)
  const { toast } = useToast()

  // Mock data with more realistic information
  const myTickets = [
    {
      id: "t1",
      title: "Fix authentication bug",
      type: "task",
      workspace: "Frontend Team",
      workspaceType: "team",
      status: "pending",
      dueDate: "2025-01-25",
      messages: 3,
      priority: "high",
      assignedBy: "Sami",
    },
    {
      id: "t2",
      title: "Design system review",
      type: "meeting",
      workspace: "Design Department",
      workspaceType: "department",
      status: "verified",
      dueDate: "2025-01-26",
      messages: 8,
      priority: "medium",
      assignedBy: "Yasmine",
    },
    {
      id: "t3",
      title: "Weekly standup",
      type: "event",
      workspace: "Backend Team",
      workspaceType: "team",
      status: "in_progress",
      dueDate: "2025-01-24",
      messages: 1,
      priority: "low",
      assignedBy: "Omar",
    },
    {
      id: "t4",
      title: "Security audit planning",
      type: "meeting",
      workspace: "Development Department",
      workspaceType: "department",
      status: "scheduled",
      dueDate: "2025-01-27",
      messages: 5,
      priority: "high",
      assignedBy: "Sami",
    },
  ]

  const workspaceStats = {
    teams: { count: 2, change: "+1 this month", trend: "up" },
    departments: { count: 2, change: "No change", trend: "stable" },
    activeTickets: { count: 5, change: "+2 this week", trend: "up" },
    completedThisWeek: { count: 8, change: "+3 from last week", trend: "up" },
  }

  const handleStatCardClick = (cardType: string) => {
    setSelectedStatCard(cardType)
    toast({
      title: `${cardType} Details`,
      description: `Viewing detailed information for ${cardType.toLowerCase()}.`,
    })
  }

  const handleQuickAction = (action: string) => {
    toast({
      title: `Quick Action: ${action}`,
      description: `Performing ${action.toLowerCase()}...`,
    })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-500"
      case "medium":
        return "text-yellow-500"
      case "low":
        return "text-green-500"
      default:
        return "text-gray-500"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-3 w-3 text-green-500" />
      case "down":
        return <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />
      default:
        return <Activity className="h-3 w-3 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Quick Actions Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h3 className="font-medium">Quick Actions</h3>
              <div className="flex gap-2">
                <Dialog open={showNewTicket} onOpenChange={setShowNewTicket}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-red-600 hover:bg-red-700">
                      <Plus className="mr-1 h-3 w-3" />
                      New Ticket
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Ticket</DialogTitle>
                      <DialogDescription>Create a new ticket in any workspace</DialogDescription>
                    </DialogHeader>
                    <NewTicketForm />
                  </DialogContent>
                </Dialog>
                <Button size="sm" variant="outline" onClick={() => handleQuickAction("Schedule Meeting")}>
                  Schedule Meeting
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleQuickAction("View Reports")}>
                  View Reports
                </Button>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleQuickAction("Export Data")}>Export Data</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleQuickAction("Import Data")}>Import Data</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleQuickAction("Backup Settings")}>
                  Backup Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card
          className="cursor-pointer hover:bg-accent/50 transition-colors"
          onClick={() => handleStatCardClick("Teams")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Teams</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{workspaceStats.teams.count}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {getTrendIcon(workspaceStats.teams.trend)}
              <span>{workspaceStats.teams.change}</span>
            </div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:bg-accent/50 transition-colors"
          onClick={() => handleStatCardClick("Departments")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Departments</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{workspaceStats.departments.count}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {getTrendIcon(workspaceStats.departments.trend)}
              <span>{workspaceStats.departments.change}</span>
            </div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:bg-accent/50 transition-colors"
          onClick={() => handleStatCardClick("Active Tickets")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tickets</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{workspaceStats.activeTickets.count}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {getTrendIcon(workspaceStats.activeTickets.trend)}
              <span>{workspaceStats.activeTickets.change}</span>
            </div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:bg-accent/50 transition-colors"
          onClick={() => handleStatCardClick("Completed")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{workspaceStats.completedThisWeek.count}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {getTrendIcon(workspaceStats.completedThisWeek.trend)}
              <span>{workspaceStats.completedThisWeek.change}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* My Tickets - Only Navigation, No Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>My Tickets</CardTitle>
              <CardDescription>Tickets assigned to you across all workspaces - Click to view details</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => handleQuickAction("View All Tickets")}>
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {myTickets.map((ticket) => (
              <Link key={ticket.id} href={`/tickets/${ticket.id}`}>
                <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer group">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(ticket.priority)}`} />
                      <h4 className="font-medium group-hover:text-red-500 transition-colors">{ticket.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {ticket.type}
                      </Badge>
                      <Badge
                        variant={
                          ticket.status === "verified"
                            ? "default"
                            : ticket.status === "pending"
                              ? "destructive"
                              : "secondary"
                        }
                        className="text-xs"
                      >
                        {ticket.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        {ticket.workspaceType === "team" ? (
                          <Users className="h-3 w-3" />
                        ) : (
                          <Building2 className="h-3 w-3" />
                        )}
                        {ticket.workspace}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Due {ticket.dueDate}
                      </span>
                      <span>{ticket.messages} messages</span>
                      <span>by {ticket.assignedBy}</span>
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-red-500 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
