import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export interface Event {
  id: number
  title: string
  date: string
  time: string
  duration: number
  type: string
  attendees: string[]
  location: string
  color: string
}

export interface UpcomingEvent {
  id: number
  title: string
  date: string
  type: string
  attendees: number
}

export interface EventFormData {
  title: string
  description: string
  date: string
  time: string
  duration: string
  type: string
  location: string
}

export const mockEvents: Event[] = [
  {
    id: 1,
    title: "Team Standup",
    date: "2024-01-15",
    time: "09:00",
    duration: 30,
    type: "meeting",
    attendees: ["sami", "yasmine", "ali", "omar"],
    location: "Conference Room A",
    color: "bg-blue-500",
  },
  {
    id: 2,
    title: "Product Review",
    date: "2024-01-16",
    time: "14:00",
    duration: 60,
    type: "review",
    attendees: ["fatima", "sami", "yasmine"],
    location: "Virtual",
    color: "bg-green-500",
  },
  {
    id: 3,
    title: "Sprint Planning",
    date: "2024-01-19",
    time: "10:00",
    duration: 120,
    type: "planning",
    attendees: ["sami", "ali", "omar", "layla"],
    location: "Conference Room B",
    color: "bg-purple-500",
  },
  {
    id: 4,
    title: "Design Review",
    date: "2024-01-22",
    time: "15:30",
    duration: 45,
    type: "review",
    attendees: ["yasmine", "mona", "sara"],
    location: "Design Studio",
    color: "bg-pink-500",
  },
  {
    id: 5,
    title: "All Hands Meeting",
    date: "2024-01-25",
    time: "11:00",
    duration: 60,
    type: "meeting",
    attendees: ["all"],
    location: "Main Auditorium",
    color: "bg-red-500",
  },
]

export const useCalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState("month")
  const [showNewEvent, setShowNewEvent] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [events, setEvents] = useState<Event[]>(mockEvents)
  const { toast } = useToast()

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    })
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const formatDateString = (date: Date) => {
    return date.toISOString().split("T")[0]
  }

  const getEventsForDate = (date: string) => {
    return events.filter((event) => event.date === date)
  }

  const upcomingEvents: UpcomingEvent[] = [
    {
      id: 1,
      title: "Team Standup",
      date: "Today, 9:00 AM",
      type: "meeting",
      attendees: 8,
    },
    {
      id: 2,
      title: "Product Review",
      date: "Tomorrow, 2:00 PM",
      type: "review",
      attendees: 12,
    },
    {
      id: 3,
      title: "Sprint Planning",
      date: "Friday, 10:00 AM",
      type: "planning",
      attendees: 15,
    },
  ]

  const createEvent = async (formData: EventFormData) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newEvent: Event = {
        id: events.length + 1,
        title: formData.title,
        date: formData.date,
        time: formData.time,
        duration: parseInt(formData.duration),
        type: formData.type,
        attendees: [], // You can add logic to parse attendees
        location: formData.location,
        color: "bg-blue-500", // Default color, you can add logic to assign colors
      }

      setEvents(prev => [...prev, newEvent])

      toast({
        title: "Event Created",
        description: `"${formData.title}" has been added to your calendar.`,
      })

      return true
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive",
      })
      return false
    }
  }

  return {
    // State
    currentDate,
    view,
    showNewEvent,
    selectedDate,
    events,
    upcomingEvents,
    
    // State setters
    setCurrentDate,
    setView,
    setShowNewEvent,
    setSelectedDate,
    
    // Utility functions
    formatDate,
    navigateMonth,
    getDaysInMonth,
    getFirstDayOfMonth,
    formatDateString,
    getEventsForDate,
    createEvent,
  }
}