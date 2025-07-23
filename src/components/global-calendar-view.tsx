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
import { ChevronLeft, ChevronRight, CalendarIcon, Plus, Users, Building2, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function GlobalCalendarView() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [showNewEvent, setShowNewEvent] = useState(false)
  const { toast } = useToast()

  // Mock global events data
  const globalEvents = [
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

  // Get events for selected date
  const selectedDateEvents = globalEvents.filter((event) => date && event.date.toDateString() === date.toDateString())

  // Get upcoming events (next 7 days)
  const upcomingEvents = globalEvents
    .filter((event) => event.date >= new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5)

  // Get calendar events for highlighting
  const calendarEvents = globalEvents.reduce(
    (acc, event) => {
      const dateKey = event.date.toDateString()
      if (!acc[dateKey]) acc[dateKey] = []
      acc[dateKey].push(event)
      return acc
    },
    {} as Record<string, typeof globalEvents>,
  )

  const handleCreateEvent = (formData: any) => {
    toast({
      title: "Event created successfully!",
      description: `"${formData.title}" has been added to the global calendar.`,
    })
    setShowNewEvent(false)
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "meeting":
        return "bg-blue-100 text-blue-800 border-blue-300"
      case "event":
        return "bg-green-100 text-green-800 border-green-300"
      case "deadline":
        return "bg-red-100 text-red-800 border-red-300"
      case "workshop":
        return "bg-purple-100 text-purple-800 border-purple-300"
      case "networking":
        return "bg-orange-100 text-orange-800 border-orange-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <CalendarIcon className="h-6 w-6 text-red-500" />
            Global Calendar
          </h1>
          <p className="text-muted-foreground">ITC club-wide events, meetings, and important dates</p>
        </div>
        <Dialog open={showNewEvent} onOpenChange={setShowNewEvent}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="mr-2 h-4 w-4" />
              New Event
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Global Event</DialogTitle>
              <DialogDescription>Add a new event to the ITC global calendar</DialogDescription>
            </DialogHeader>
            <CreateEventForm onSubmit={handleCreateEvent} />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="calendar" className="space-y-4">
        <TabsList>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
          <TabsTrigger value="all">All Events</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Calendar</CardTitle>
                <CardDescription>Select a date to view events</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
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
              <CardHeader className="flex flex-row items-center">
                <div>
                  <CardTitle>
                    {date
                      ? `Events for ${date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`
                      : "Select a date"}
                  </CardTitle>
                  <CardDescription>
                    {selectedDateEvents.length === 0
                      ? "No events scheduled for this date"
                      : `${selectedDateEvents.length} event${selectedDateEvents.length > 1 ? "s" : ""} scheduled`}
                  </CardDescription>
                </div>
                <div className="ml-auto flex items-center gap-2">
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
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {selectedDateEvents.length === 0 ? (
                  <div className="flex h-[300px] items-center justify-center border rounded-md">
                    <p className="text-muted-foreground">No events scheduled for this date</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedDateEvents.map((event) => (
                      <div key={event.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold">{event.title}</h3>
                          <Badge className={getEventTypeColor(event.type)}>{event.type}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{event.description}</p>
                        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {event.time} ({event.duration})
                          </div>
                          <div className="flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            {event.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {event.attendees > 0 ? `${event.attendees} attendees` : "No attendees"}
                          </div>
                          <div>Organized by {event.organizer}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Next events in the ITC calendar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">{event.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {event.date.toLocaleDateString()} at {event.time}
                        </p>
                      </div>
                      <Badge className={getEventTypeColor(event.type)}>{event.type}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{event.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        {event.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {event.attendees > 0 ? `${event.attendees} attendees` : "No attendees"}
                      </span>
                      <span>by {event.organizer}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Events</CardTitle>
              <CardDescription>Complete list of ITC events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {globalEvents
                  .sort((a, b) => a.date.getTime() - b.date.getTime())
                  .map((event) => (
                    <div key={event.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{event.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {event.date.toLocaleDateString()} at {event.time}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getEventTypeColor(event.type)}>{event.type}</Badge>
                          {event.isRecurring && <Badge variant="outline">Recurring</Badge>}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{event.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          {event.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {event.attendees > 0 ? `${event.attendees} attendees` : "No attendees"}
                        </span>
                        <span>by {event.organizer}</span>
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

// Create Event Form Component
function CreateEventForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    duration: "",
    type: "",
    location: "",
    isRecurring: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({
      title: "",
      description: "",
      date: "",
      time: "",
      duration: "",
      type: "",
      location: "",
      isRecurring: false,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="eventTitle">Event Title</Label>
        <Input
          id="eventTitle"
          placeholder="Enter event title..."
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="eventDescription">Description</Label>
        <Textarea
          id="eventDescription"
          placeholder="Describe the event..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="eventDate">Date</Label>
          <Input
            id="eventDate"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="eventTime">Time</Label>
          <Input
            id="eventTime"
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="eventDuration">Duration</Label>
          <Input
            id="eventDuration"
            placeholder="e.g., 2 hours"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="eventLocation">Location</Label>
          <Input
            id="eventLocation"
            placeholder="Event location..."
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            required
          />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit" className="bg-red-600 hover:bg-red-700">
          Create Event
        </Button>
      </div>
    </form>
  )
}
