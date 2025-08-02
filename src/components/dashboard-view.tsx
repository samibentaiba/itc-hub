"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import Link from "next/link"
import { useRouter } from "next/navigation"
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
import { useToast } from "@/hooks/use-toast"

export function DashboardView() {
  const [selectedStatCard, setSelectedStatCard] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

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

  const handleStatCardClick = async (cardType: string) => {
    setSelectedStatCard(cardType)
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Navigate based on card type
      switch (cardType) {
        case "Teams":
          router.push("/teams")
          break
        case "Departments":
          router.push("/departments")
          break
        case "Active Tickets":
          router.push("/tickets?status=active")
          break
        case "Completed":
          router.push("/tickets?status=completed")
          break
        default:
          break
      }

      toast({
        title: `${cardType} Details`,
        description: `Navigating to ${cardType.toLowerCase()} overview.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load details. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setSelectedStatCard(null)
    }
  }

  const handleQuickAction = async (action: string) => {
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      switch (action) {
        case "View All Tickets":
          router.push("/tickets")
          break
        case "Schedule Meeting":
          // Open calendar or meeting scheduler
          toast({
            title: "Meeting Scheduler",
            description: "Opening meeting scheduler...",
          })
          break
        case "View Reports":
          // Navigate to reports page
          router.push("/reports")
          break
        case "Export Data":
          // Trigger data export
          const exportData = {
            tickets: myTickets,
            stats: workspaceStats,
            exportDate: new Date().toISOString(),
          }
          const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
          const url = URL.createObjectURL(blob)
          const a = document.createElement("a")
          a.href = url
          a.download = `dashboard-export-${new Date().toISOString().split("T")[0]}.json`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)

          toast({
            title: "Data Exported",
            description: "Dashboard data has been exported successfully.",
          })
          break
        case "Import Data":
          // Trigger file input for import
          const input = document.createElement("input")
          input.type = "file"
          input.accept = ".json"
          input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0]
            if (file) {
              const reader = new FileReader()
              reader.onload = (e) => {
                try {
                  const data = JSON.parse(e.target?.result as string)
                  toast({
                    title: "Data Imported",
                    description: `Successfully imported data from ${file.name}`,
                  })
                } catch (error) {
                  toast({
                    title: "Import Error",
                    description: "Invalid file format. Please select a valid JSON file.",
                    variant: "destructive",
                  })
                }
              }
              reader.readAsText(file)
            }
          }
          input.click()
          break
        case "Backup Settings":
          // Create settings backup
          const settings = {
            theme: "dark",
            notifications: true,
            language: "en",
            backupDate: new Date().toISOString(),
          }
          const settingsBlob = new Blob([JSON.stringify(settings, null, 2)], { type: "application/json" })
          const settingsUrl = URL.createObjectURL(settingsBlob)
          const settingsLink = document.createElement("a")
          settingsLink.href = settingsUrl
          settingsLink.download = `settings-backup-${new Date().toISOString().split("T")[0]}.json`
          document.body.appendChild(settingsLink)
          settingsLink.click()
          document.body.removeChild(settingsLink)
          URL.revokeObjectURL(settingsUrl)

          toast({
            title: "Settings Backed Up",
            description: "Your settings have been backed up successfully.",
          })
          break
        default:
          toast({
            title: `Quick Action: ${action}`,
            description: `Performing ${action.toLowerCase()}...`,
          })
      }
    } catch (error) {
      toast({
        title: "Action Failed",
        description: "Failed to perform action. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
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
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Summary of different, but related data sets, presented in a way that makes the related information easier to understand</p>
        </div>
      </div>


      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card
          className="cursor-pointer hover:bg-accent/50 transition-colors"
          onClick={() => handleStatCardClick("Teams")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs sm:text-sm font-medium">My Teams</CardTitle>
            <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold text-red-500">
              {selectedStatCard === "Teams" && isLoading ? "..." : workspaceStats.teams.count}
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              {getTrendIcon(workspaceStats.teams.trend)}
              <span className="truncate">{workspaceStats.teams.change}</span>
            </div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:bg-accent/50 transition-colors"
          onClick={() => handleStatCardClick("Departments")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm sm:text-sm font-medium">My Departments</CardTitle>
            <Building2 className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold text-red-500">
              {selectedStatCard === "Departments" && isLoading ? "..." : workspaceStats.departments.count}
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              {getTrendIcon(workspaceStats.departments.trend)}
              <span className="truncate">{workspaceStats.departments.change}</span>
            </div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:bg-accent/50 transition-colors"
          onClick={() => handleStatCardClick("Active Tickets")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm sm:text-sm font-medium">Active Tickets</CardTitle>
            <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold text-red-500">
              {selectedStatCard === "Active Tickets" && isLoading ? "..." : workspaceStats.activeTickets.count}
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              {getTrendIcon(workspaceStats.activeTickets.trend)}
              <span className="truncate">{workspaceStats.activeTickets.change}</span>
            </div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:bg-accent/50 transition-colors"
          onClick={() => handleStatCardClick("Completed")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm sm:text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold text-red-500">
              {selectedStatCard === "Completed" && isLoading ? "..." : workspaceStats.completedThisWeek.count}
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              {getTrendIcon(workspaceStats.completedThisWeek.trend)}
              <span className="truncate">{workspaceStats.completedThisWeek.change}</span>
            </div>
          </CardContent>
        </Card>
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
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
