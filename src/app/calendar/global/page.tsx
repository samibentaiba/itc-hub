"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Plus, Users, Building2, Clock, Loader2, Download, RefreshCw, Filter } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

export default function GlobalCalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [showNewEvent, setShowNewEvent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingAction, setLoadingAction] = useState<string | null>(null)
  const [filterType, setFilterType] = useState<string>("all")
  const { toast } = useToast()

  // Mock global events data
  const [globalEvents, setGlobalEvents] = useState([
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
  ])

  const handleAddEvent = async (formData: {
    title: string;
    description: string;
    date: string;
    time: string;
    type: string;
    location: string;
    isRecurring: boolean;
  }) => {
    setIsLoading(true)
    setLoadingAction("add-event")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const newEvent = {
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
        return "default"
      case "event":
        return "secondary"
      case "deadline":
        return "destructive"
      case "networking":
        return "outline"
      case "workshop":
        return "secondary"
      default:
        return "outline"
    }
  }

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

  return (
    <div className="space-y-4 sm:space-y-6 ">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 sm:h-6 sm:w-6 text-red-500" />
            Global Calendar
          </h1>
          <p className="text-sm text-muted-foreground">Community-wide events and important dates</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshCalendar}
            disabled={loadingAction === "refresh"}
            className="text-xs sm:text-sm bg-transparent"
          >
            {loadingAction === "refresh" ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCalendar}
            disabled={loadingAction === "export"}
            className="text-xs sm:text-sm bg-transparent"
          >
            {loadingAction === "export" ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Export
          </Button>

        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-2">
                            <CardTitle className="text-xs sm:text-sm font-medium">Today&apos;s Events</CardTitle>
            <CalendarIcon className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className=" pt-0">
            <div className="text-xl sm:text-2xl font-bold text-red-500">{todayEvents.length}</div>
            <p className="text-xs text-muted-foreground">Happening today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Events</CardTitle>
            <CalendarIcon className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className=" pt-0">
            <div className="text-xl sm:text-2xl font-bold text-red-500">{globalEvents.length}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Attendees</CardTitle>
            <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className=" pt-0">
            <div className="text-xl sm:text-2xl font-bold text-red-500">
              {globalEvents.reduce((sum, event) => sum + event.attendees, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Total registered</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Workshops</CardTitle>
            <Building2 className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className=" pt-0">
            <div className="text-xl sm:text-2xl font-bold text-red-500">
              {globalEvents.filter((e) => e.type === "workshop").length}
            </div>
            <p className="text-xs text-muted-foreground">Learning sessions</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="calendar" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calendar" className="text-xs sm:text-sm">
            Calendar View
          </TabsTrigger>
          <TabsTrigger value="events" className="text-xs sm:text-sm">
            All Events
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="text-xs sm:text-sm">
            Upcoming
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Calendar */}
            <Card className="lg:col-span-2">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Calendar</CardTitle>
                <CardDescription className="text-sm">Select a date to view events</CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border w-full" />
              </CardContent>
            </Card>

            {/* Selected Date Events */}
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">{date ? format(date, "PPP") : "Select a date"}</CardTitle>
                <CardDescription className="text-sm">Events for selected date</CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="space-y-3">
                  {date &&
                    globalEvents
                      .filter((event) => event.date.toDateString() === date.toDateString())
                      .map((event) => (
                        <div key={event.id} className="p-3 border rounded-lg space-y-2">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm truncate">{event.title}</h4>
                              <p className="text-xs text-muted-foreground truncate">{event.description}</p>
                            </div>
                            <Badge variant={getEventTypeBadgeVariant(event.type)} className="text-xs ml-2">
                              {event.type}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>
                              {event.time} ({event.duration})
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Users className="h-3 w-3" />
                            <span>{event.attendees} attendees</span>
                          </div>
                        </div>
                      ))}
                  {date &&
                    globalEvents.filter((event) => event.date.toDateString() === date.toDateString()).length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">No events on this date</p>
                    )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-lg sm:text-xl">All Events</CardTitle>
                  <CardDescription className="text-sm">Complete list of community events</CardDescription>
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-full sm:w-40 text-sm">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="meeting">Meetings</SelectItem>
                    <SelectItem value="event">Events</SelectItem>
                    <SelectItem value="deadline">Deadlines</SelectItem>
                    <SelectItem value="networking">Networking</SelectItem>
                    <SelectItem value="workshop">Workshops</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="space-y-3 sm:space-y-4">
                {filteredEvents.map((event) => (
                  <div key={event.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`w-3 h-3 rounded-full ${getEventTypeColor(event.type)}`} />
                          <h4 className="font-medium text-sm sm:text-base truncate">{event.title}</h4>
                          {event.isRecurring && (
                            <Badge variant="outline" className="text-xs">
                              Recurring
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground">{event.description}</p>
                      </div>
                      <Badge variant={getEventTypeBadgeVariant(event.type)} className="text-xs">
                        {event.type}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3" />
                        <span>{format(event.date, "MMM dd")}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{event.attendees} attendees</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <span className="text-xs text-muted-foreground">Organized by {event.organizer}</span>
                      <Button size="sm" variant="outline" className="text-xs w-full sm:w-auto bg-transparent">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl">Upcoming Events</CardTitle>
              <CardDescription className="text-sm">Next 5 events in chronological order</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-red-500 text-white rounded-lg flex flex-col items-center justify-center">
                        <div className="text-xs font-medium">{format(event.date, "MMM")}</div>
                        <div className="text-sm font-bold">{format(event.date, "dd")}</div>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm sm:text-base truncate">{event.title}</h4>
                          <p className="text-xs sm:text-sm text-muted-foreground truncate">{event.description}</p>
                        </div>
                        <Badge variant={getEventTypeBadgeVariant(event.type)} className="text-xs ml-2">
                          {event.type}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>{event.attendees} attendees</span>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <span className="text-xs text-muted-foreground">by {event.organizer}</span>
                        <Button size="sm" variant="outline" className="text-xs w-full sm:w-auto bg-transparent">
                          Register
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {upcomingEvents.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">No upcoming events</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Add Event Form Component
function AddEventForm({ onSubmit, isLoading }: { onSubmit: (data: {
  title: string;
  description: string;
  date: string;
  time: string;
  type: string;
  location: string;
  isRecurring: boolean;
}) => void; isLoading: boolean }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    type: "event",
    location: "",
    isRecurring: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }
    if (!formData.date) {
      newErrors.date = "Date is required"
    }
    if (!formData.time) {
      newErrors.time = "Time is required"
    }
    if (!formData.location.trim()) {
      newErrors.location = "Location is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    onSubmit(formData)
    setFormData({
      title: "",
      description: "",
      date: "",
      time: "",
      type: "event",
      location: "",
      isRecurring: false,
    })
    setErrors({})
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="eventTitle" className="text-sm">
          Event Title <span className="text-red-500">*</span>
        </Label>
        <Input
          id="eventTitle"
          placeholder="Enter event title..."
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className={cn("text-sm", errors.title && "border-red-500")}
          disabled={isLoading}
        />
        {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="eventDescription" className="text-sm">
          Description <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="eventDescription"
          placeholder="Describe the event..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className={cn("text-sm min-h-[80px]", errors.description && "border-red-500")}
          disabled={isLoading}
        />
        {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="eventDate" className="text-sm">
            Date <span className="text-red-500">*</span>
          </Label>
          <Input
            id="eventDate"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className={cn("text-sm", errors.date && "border-red-500")}
            disabled={isLoading}
          />
          {errors.date && <p className="text-xs text-red-500">{errors.date}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="eventTime" className="text-sm">
            Time <span className="text-red-500">*</span>
          </Label>
          <Input
            id="eventTime"
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            className={cn("text-sm", errors.time && "border-red-500")}
            disabled={isLoading}
          />
          {errors.time && <p className="text-xs text-red-500">{errors.time}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm">Event Type</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => setFormData({ ...formData, type: value })}
            disabled={isLoading}
          >
            <SelectTrigger className="text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="meeting">🤝 Meeting</SelectItem>
              <SelectItem value="event">🎉 Event</SelectItem>
              <SelectItem value="deadline">⏰ Deadline</SelectItem>
              <SelectItem value="networking">🌐 Networking</SelectItem>
              <SelectItem value="workshop">🛠️ Workshop</SelectItem>
            </SelectContent>
          </Select>
        </div>


      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="eventLocation" className="text-sm">
            Location <span className="text-red-500">*</span>
          </Label>
          <Input
            id="eventLocation"
            placeholder="Enter event location..."
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className={cn("text-sm", errors.location && "border-red-500")}
            disabled={isLoading}
          />
          {errors.location && <p className="text-xs text-red-500">{errors.location}</p>}
        </div>


      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          className="text-sm bg-transparent"
          disabled={isLoading}
          onClick={() => {
            setFormData({
              title: "",
              description: "",
              date: "",
              time: "",
              type: "event",
              location: "",
              isRecurring: false,
            })
            setErrors({})
          }}
        >
          Reset
        </Button>
        <Button
          type="submit"
          className="bg-red-600 hover:bg-red-700 text-sm"
          disabled={
            isLoading ||
            !formData.title ||
            !formData.description ||
            !formData.date ||
            !formData.time ||
            !formData.location
          }
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Event...
            </>
          ) : (
            "Create Event"
          )}
        </Button>
      </div>
    </form>
  )
}
