import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export interface Ticket {
  id: string
  title: string
  type: string
  workspace: string
  workspaceType: string
  status: string
  dueDate: string
  messages: number
  priority: string
  assignedBy: string
}

export interface WorkspaceStats {
  teams: { count: number; change: string; trend: string }
  departments: { count: number; change: string; trend: string }
  activeTickets: { count: number; change: string; trend: string }
  completedThisWeek: { count: number; change: string; trend: string }
}

export const useDashboardPage = () => {
  const [selectedStatCard, setSelectedStatCard] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  // Mock data with more realistic information
  const myTickets: Ticket[] = [
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

  const workspaceStats: WorkspaceStats = {
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
        return "up"
      case "down":
        return "down"
      default:
        return "stable"
    }
  }

  return {
    // State
    selectedStatCard,
    isLoading,
    myTickets,
    workspaceStats,
    
    // Actions
    handleStatCardClick,
    handleQuickAction,
    
    // Utilities
    getPriorityColor,
    getTrendIcon,
  }
}