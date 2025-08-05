"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Clock,
  Users,
  Building2,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Activity,
  ExternalLink,
} from "lucide-react"
import { useDashboardPage } from "./hook"

export default function DashboardPage() {
  const {
    selectedStatCard,
    isLoading,
    myTickets,
    workspaceStats,
    handleStatCardClick,
    handleQuickAction,
    getPriorityColor,
    getTrendIcon,
  } = useDashboardPage()

  const renderTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-3 w-3 text-green-500" />
      case "down":
        return <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />
      default:
        return <Activity className="h-3 w-3 text-gray-500" />
    }
  }

  const StatCard = ({ 
    title, 
    value, 
    change, 
    trend, 
    icon: Icon, 
    onClick, 
    isSelected 
  }: {
    title: string
    value: number
    change: string
    trend: string
    icon: any
    onClick: () => void
    isSelected: boolean
  }) => (
    <Card
      className="cursor-pointer hover:bg-accent/50 transition-colors"
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-xs sm:text-sm font-medium">{title}</CardTitle>
        <Icon className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="px-3 sm:px-6 pt-0">
        <div className="text-xl sm:text-2xl font-bold text-red-500">
          {isSelected && isLoading ? "..." : value}
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          {renderTrendIcon(trend)}
          <span className="truncate">{change}</span>
        </div>
      </CardContent>
    </Card>
  )

  const TicketCard = ({ ticket }: { ticket: any }) => (
    <Link key={ticket.id} href={`/tickets/${ticket.id}`}>
      <div className="flex flex-col sm:flex-row items-start mb-5 sm:items-center justify-between p-3 sm:p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer group gap-3 sm:gap-0">
        <div className="space-y-2 flex-1 w-full sm:w-auto">
          <div className="flex flex-wrap items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getPriorityColor(ticket.priority)} flex-shrink-0`} />
            <h4 className="font-medium group-hover:text-red-500 transition-colors text-sm sm:text-base truncate">
              {ticket.title}
            </h4>
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
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              {ticket.workspaceType === "team" ? (
                <Users className="h-3 w-3" />
              ) : (
                <Building2 className="h-3 w-3" />
              )}
              <span className="truncate max-w-[120px] sm:max-w-none">{ticket.workspace}</span>
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Due {ticket.dueDate}
            </span>
            <span className="hidden sm:inline">{ticket.messages} messages</span>
            <span className="hidden md:inline">by {ticket.assignedBy}</span>
          </div>
        </div>
        <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-red-500 transition-colors flex-shrink-0 self-start sm:self-center" />
      </div>
    </Link>
  )

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Summary of different, but related data sets, presented in a way that makes the related information easier to understand
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="My Teams"
          value={workspaceStats.teams.count}
          change={workspaceStats.teams.change}
          trend={workspaceStats.teams.trend}
          icon={Users}
          onClick={() => handleStatCardClick("Teams")}
          isSelected={selectedStatCard === "Teams"}
        />
        
        <StatCard
          title="My Departments"
          value={workspaceStats.departments.count}
          change={workspaceStats.departments.change}
          trend={workspaceStats.departments.trend}
          icon={Building2}
          onClick={() => handleStatCardClick("Departments")}
          isSelected={selectedStatCard === "Departments"}
        />
        
        <StatCard
          title="Active Tickets"
          value={workspaceStats.activeTickets.count}
          change={workspaceStats.activeTickets.change}
          trend={workspaceStats.activeTickets.trend}
          icon={AlertCircle}
          onClick={() => handleStatCardClick("Active Tickets")}
          isSelected={selectedStatCard === "Active Tickets"}
        />
        
        <StatCard
          title="Completed"
          value={workspaceStats.completedThisWeek.count}
          change={workspaceStats.completedThisWeek.change}
          trend={workspaceStats.completedThisWeek.trend}
          icon={CheckCircle}
          onClick={() => handleStatCardClick("Completed")}
          isSelected={selectedStatCard === "Completed"}
        />
      </div>

      {/* My Tickets - Only Navigation, No Actions */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div>
              <CardTitle className="text-lg sm:text-xl">My Tickets</CardTitle>
              <CardDescription className="text-sm">
                Tickets assigned to you across all workspaces - Click to view details
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickAction("View All Tickets")}
              disabled={isLoading}
              className="text-sm sm:text-sm w-full sm:w-auto mt-4 sm:mt-0"
            >
              {isLoading ? "Loading..." : "View All"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="space-y-3 sm:space-y-4">
            {myTickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}