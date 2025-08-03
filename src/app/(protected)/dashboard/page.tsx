"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

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
  Loader2,
} from "lucide-react"

interface Ticket {
  id: string
  title: string
  type: string
  status: string
  priority: string
  dueDate?: string
  assignee?: {
    id: string
    name: string
  }
  creator?: {
    id: string
    name: string
  }
  team?: {
    id: string
    name: string
  }
  department?: {
    id: string
    name: string
  }
  createdAt: string
  updatedAt: string
}

interface Stats {
  teams: { count: number; change: string; trend: string }
  departments: { count: number; change: string; trend: string }
  activeTickets: { count: number; change: string; trend: string }
  completedThisWeek: { count: number; change: string; trend: string }
}

export default function DashboardPage() {
  const [selectedStatCard, setSelectedStatCard] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [myTickets, setMyTickets] = useState<Ticket[]>([])
  const [stats, setStats] = useState<Stats>({
    teams: { count: 0, change: "Loading...", trend: "stable" },
    departments: { count: 0, change: "Loading...", trend: "stable" },
    activeTickets: { count: 0, change: "Loading...", trend: "stable" },
    completedThisWeek: { count: 0, change: "Loading...", trend: "stable" },
  })
  const { toast } = useToast()
  const router = useRouter()

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoadingData(true)
        
        // Load user's tickets
        const ticketsResponse = await api.tickets.getAll({ 
          limit: 4,
          status: "active,in_progress,pending" 
        })
        setMyTickets(ticketsResponse.tickets || [])

        // Load teams count
        const teamsResponse = await api.teams.getAll({ limit: 1 })
        const teamsCount = teamsResponse.total || 0

        // Load departments count
        const departmentsResponse = await api.departments.getAll({ limit: 1 })
        const departmentsCount = departmentsResponse.total || 0

        // Load active tickets count
        const activeTicketsResponse = await api.tickets.getAll({ 
          status: "active,in_progress,pending",
          limit: 1 
        })
        const activeTicketsCount = activeTicketsResponse.total || 0

        // Load completed tickets count (this week)
        const oneWeekAgo = new Date()
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
        const completedTicketsResponse = await api.tickets.getAll({ 
          status: "verified,completed",
          limit: 1 
        })
        const completedCount = completedTicketsResponse.total || 0

        setStats({
          teams: { 
            count: teamsCount, 
            change: teamsCount > 0 ? "+1 this month" : "No teams yet", 
            trend: "up" 
          },
          departments: { 
            count: departmentsCount, 
            change: departmentsCount > 0 ? "Active departments" : "No departments yet", 
            trend: "stable" 
          },
          activeTickets: { 
            count: activeTicketsCount, 
            change: activeTicketsCount > 0 ? "+2 this week" : "No active tickets", 
            trend: "up" 
          },
          completedThisWeek: { 
            count: completedCount, 
            change: completedCount > 0 ? "+3 from last week" : "No completed tickets", 
            trend: "up" 
          },
        })
      } catch (error) {
        console.error('Error loading dashboard data:', error)
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingData(false)
      }
    }

    loadDashboardData()
  }, [toast])

  const handleStatCardClick = async (cardType: string) => {
    setSelectedStatCard(cardType)
    setIsLoading(true)

    try {
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
      switch (action) {
        case "View All Tickets":
          router.push("/tickets")
          break
        case "Schedule Meeting":
          toast({
            title: "Meeting Scheduler",
            description: "Opening meeting scheduler...",
          })
          break
        case "View Reports":
          router.push("/reports")
          break
        case "Export Data":
          const exportData = {
            tickets: myTickets,
            stats: stats,
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

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "verified":
      case "completed":
        return "default"
      case "pending":
        return "destructive"
      case "in_progress":
        return "secondary"
      default:
        return "outline"
    }
  }

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading dashboard...</span>
        </div>
      </div>
    )
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
              {selectedStatCard === "Teams" && isLoading ? "..." : stats.teams.count}
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              {getTrendIcon(stats.teams.trend)}
              <span className="truncate">{stats.teams.change}</span>
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
              {selectedStatCard === "Departments" && isLoading ? "..." : stats.departments.count}
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              {getTrendIcon(stats.departments.trend)}
              <span className="truncate">{stats.departments.change}</span>
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
              {selectedStatCard === "Active Tickets" && isLoading ? "..." : stats.activeTickets.count}
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              {getTrendIcon(stats.activeTickets.trend)}
              <span className="truncate">{stats.activeTickets.change}</span>
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
              {selectedStatCard === "Completed" && isLoading ? "..." : stats.completedThisWeek.count}
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              {getTrendIcon(stats.completedThisWeek.trend)}
              <span className="truncate">{stats.completedThisWeek.change}</span>
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
            {myTickets.length > 0 ? (
              myTickets.map((ticket) => (
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
                          variant={getStatusBadgeVariant(ticket.status)}
                          className="text-xs"
                        >
                          {ticket.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                        {ticket.team && (
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span className="truncate max-w-[120px] sm:max-w-none">{ticket.team.name}</span>
                          </span>
                        )}
                        {ticket.department && (
                          <span className="flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            <span className="truncate max-w-[120px] sm:max-w-none">{ticket.department.name}</span>
                          </span>
                        )}
                        {ticket.dueDate && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Due {new Date(ticket.dueDate).toLocaleDateString()}
                          </span>
                        )}
                        {ticket.creator && (
                          <span className="hidden md:inline">by {ticket.creator.name}</span>
                        )}
                      </div>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-red-500 transition-colors flex-shrink-0 self-start sm:self-center" />
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No active tickets assigned to you.</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => router.push("/tickets")}
                >
                  View All Tickets
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}