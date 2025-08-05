import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export interface GlobalEvent {
  id: string
  title: string
  description: string
  date: Date
  time: string
  duration: string
  type: string
  location: string
  organizer: string
  attendees: number
  isRecurring: boolean
}

export interface EventFormData {
  title: string
  description: string
  date: string
  time: string
  type: string
  location: string
  isRecurring: boolean
}

export type LoadingAction = "add-event" | "export" | "refresh" | null

const mockGlobalEventsData: GlobalEvent[] = [
  {
    id: "ge1",
    title: "ITC General Assembly",
    description: "Monthly general meeting for all ITC members",
    date: new Date("2025-01-24"),
    time: "14:00",
    duration: "2 hours",
    type: "meeting",
    location: "Main Hall",
    organizer: "ITC Board",
    attendees: 45,
    isRecurring: true,
  },
  {
    id: "ge2",
    title: "Tech Talk: AI in Development",
    description: "Guest speaker discussing AI applications in software development",
    date: new Date("2025-01-26"),
    time: "16:00",
    duration: "1.5 hours",
    type: "event",
    location: "Conference Room A",
    organizer: "Sami",
    attendees: 25,
    isRecurring: false,
  },
  {
    id: "ge3",
    title: "Project Showcase Deadline",
    description: "Final deadline for project submissions",
    date: new Date("2025-01-25"),
    time: "23:59",
    duration: "All day",
    type: "deadline",
    location: "Online",
    organizer: "Academic Committee",
    attendees: 0,
    isRecurring: false,
  },
  {
    id: "ge4",
    title: "Networking Event",
    description: "Connect with industry professionals and alumni",
    date: new Date("2025-01-28"),
    time: "18:00",
    duration: "3 hours",
    type: "networking",
    location: "Student Center",
    organizer: "Career Services",
    attendees: 60,
    isRecurring: false,
  },
  {
    id: "ge5",
    title: "Workshop: React Best Practices",
    description: "Hands-on workshop covering React development best practices",
    date: new Date("2025-01-27"),
    time: "10:00",
    duration: "4 hours",
    type: "workshop",
    location: "Lab 101",
    organizer: "Yasmine",
    attendees: 20,
    isRecurring: false,
  },
]

export const useGlobalCalendarPage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [showNewEvent, setShowNewEvent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingAction, setLoadingAction] = useState<LoadingAction>(null)
  const [filterType, setFilterType] = useState<string>("all")
  const [globalEvents, setGlobalEvents] = useState<GlobalEvent[]>(mockGlobalEventsData)
  const { toast } = useToast()

  const handleAddEvent = async (formData: EventFormData) => {
    setIsLoading(true)
    setLoadingAction("add-event")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const newEvent: GlobalEvent = {
        id: `ge${globalEvents.length + 1}`,
        title: formData.title,
        description: formData.description,
        date: new Date(formData.date),
        time: formData.time,
        duration: "60",
        type: formData.type,
        location: formData.location,
        organizer: "Current User",
        attendees: 0,
        isRecurring: formData.isRecurring || false,
      }

      setGlobalEvents([...globalEvents, newEvent])

      toast({
        title: "Event created successfully!",
        description: `"${formData.title}" has been added to the global calendar.`,
      })
      setShowNewEvent(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setLoadingAction(null)
    }
  }

  const handleExportCalendar = async () => {
    setLoadingAction("export")

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const calendarData = {
        events: globalEvents,
        exportDate: new Date().toISOString(),
        version: "1.0",
      }

      const blob = new Blob([JSON.stringify(calendarData, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `itc-calendar-export-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Calendar exported successfully",
        description: "Calendar data has been exported to your downloads folder.",
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export calendar. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoadingAction(null)
    }
  }

  const handleRefreshCalendar = async () => {
    setLoadingAction("refresh")

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Calendar refreshed",
        description: "All events have been refreshed from the server.",
      })
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh calendar. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoadingAction(null)
    }
  }

  const handleViewEventDetails = (event: GlobalEvent) => {
    // Show event details in a modal or navigate to event detail page
    toast({
      title: "Event Details",
      description: `Viewing details for "${event.title}". Event detail page will be implemented in the next phase.`,
    })
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "meeting":
        return "bg-blue-500"
      case "event":
        return "bg-green-500"
      case "deadline":
        return "bg-red-500"
      case "networking":
        return "bg-purple-500"
      case "workshop":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  const getEventTypeBadgeVariant = (type: string) => {
    switch (type) {
      case "meeting":
        return "default" as const
      case "event":
        return "secondary" as const
      case "deadline":
        return "destructive" as const
      case "networking":
        return "outline" as const
      case "workshop":
        return "secondary" as const
      default:
        return "outline" as const
    }
  }

  // Computed values
  const filteredEvents = globalEvents.filter((event) => {
    if (filterType === "all") return true
    return event.type === filterType
  })

  const todayEvents = globalEvents.filter((event) => {
    const today = new Date()
    return event.date.toDateString() === today.toDateString()
  })

  const upcomingEvents = globalEvents
    .filter((event) => event.date > new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5)

  const totalAttendees = globalEvents.reduce((sum, event) => sum + event.attendees, 0)
  const totalWorkshops = globalEvents.filter((e) => e.type === "workshop").length

  const selectedDateEvents = date 
    ? globalEvents.filter((event) => event.date.toDateString() === date.toDateString())
    : []

  return {
    // State
    date,
    showNewEvent,
    isLoading,
    loadingAction,
    filterType,
    globalEvents,
    
    // State setters
    setDate,
    setShowNewEvent,
    setIsLoading,
    setLoadingAction,
    setFilterType,
    setGlobalEvents,
    
    // Event handlers
    handleAddEvent,
    handleExportCalendar,
    handleRefreshCalendar,
    handleViewEventDetails,
    
    // Utility functions
    getEventTypeColor,
    getEventTypeBadgeVariant,
    
    // Computed values
    filteredEvents,
    todayEvents,
    upcomingEvents,
    totalAttendees,
    totalWorkshops,
    selectedDateEvents,
  }
}