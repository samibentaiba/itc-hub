"use client"

import { useState } from "react"
import { Calendar, ChevronLeft, ChevronRight, Plus, Filter, Clock, Users, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useCalendarPage, type EventFormData } from "./hook"

export default function CalendarPage() {
  const {
    currentDate,
    view,
    showNewEvent,
    selectedDate,
    events,
    upcomingEvents,
    setView,
    setShowNewEvent,
    setSelectedDate,
    formatDate,
    navigateMonth,
    getDaysInMonth,
    getFirstDayOfMonth,
    formatDateString,
    getEventsForDate,
    createEvent,
  } = useCalendarPage()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Calendar</h1>
          <p className="text-muted-foreground">Manage your schedule and events</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={view} onValueChange={setView}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="day">Day</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Calendar */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {formatDate(currentDate)}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => navigateMonth("prev")}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => navigateMonth("next")}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CalendarView 
                currentDate={currentDate} 
                view={view}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                getDaysInMonth={getDaysInMonth}
                getFirstDayOfMonth={getFirstDayOfMonth}
                formatDateString={formatDateString}
                getEventsForDate={getEventsForDate}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start bg-transparent"
                onClick={() => setShowNewEvent(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Calendar className="h-4 w-4 mr-2" />
                View Global Calendar
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Filter className="h-4 w-4 mr-2" />
                Filter Events
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Your next scheduled events</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="border rounded-lg p-3">
                  <h4 className="font-medium">{event.title}</h4>
                  <p className="text-sm text-muted-foreground">{event.date}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">{event.type}</span>
                    <span className="text-xs text-muted-foreground">{event.attendees} attendees</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create Event Dialog */}
      <Dialog open={showNewEvent} onOpenChange={setShowNewEvent}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
            <DialogDescription>
              Add a new event to your personal calendar.
            </DialogDescription>
          </DialogHeader>
          <CreateEventForm 
            onClose={() => setShowNewEvent(false)} 
            createEvent={createEvent}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Create Event Form Component
interface CreateEventFormProps {
  onClose: () => void
  createEvent: (formData: EventFormData) => Promise<boolean>
}

function CreateEventForm({ onClose, createEvent }: CreateEventFormProps) {
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    date: "",
    time: "",
    duration: "60",
    type: "meeting",
    location: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const success = await createEvent(formData)
    
    if (success) {
      onClose()
    }
    
    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Event Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter event title"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter event description"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="time">Time</Label>
          <Input
            id="time"
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="duration">Duration (minutes)</Label>
          <Select value={formData.duration} onValueChange={(value) => setFormData({ ...formData, duration: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">15 minutes</SelectItem>
              <SelectItem value="30">30 minutes</SelectItem>
              <SelectItem value="60">1 hour</SelectItem>
              <SelectItem value="90">1.5 hours</SelectItem>
              <SelectItem value="120">2 hours</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Event Type</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="meeting">Meeting</SelectItem>
              <SelectItem value="review">Review</SelectItem>
              <SelectItem value="planning">Planning</SelectItem>
              <SelectItem value="workshop">Workshop</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          placeholder="Enter location or 'Virtual'"
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Event"}
        </Button>
      </div>
    </form>
  )
}

// Calendar View Component
interface CalendarViewProps {
  currentDate: Date
  view: string
  selectedDate: Date | null
  setSelectedDate: (date: Date | null) => void
  getDaysInMonth: (date: Date) => number
  getFirstDayOfMonth: (date: Date) => number
  formatDateString: (date: Date) => string
  getEventsForDate: (date: string) => any[]
}

function CalendarView({ 
  currentDate, 
  view, 
  selectedDate,
  setSelectedDate,
  getDaysInMonth,
  getFirstDayOfMonth,
  formatDateString,
  getEventsForDate
}: CalendarViewProps) {

  const renderMonthView = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-border/50"></div>)
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      const dateString = formatDateString(date)
      const events = getEventsForDate(dateString)
      const isToday = dateString === formatDateString(new Date())
      const isSelected = selectedDate && formatDateString(selectedDate) === dateString

      days.push(
        <div
          key={day}
          className={`h-24 border border-border/50 p-1 cursor-pointer hover:bg-muted/50 ${
            isToday ? "bg-primary/10" : ""
          } ${isSelected ? "bg-primary/20" : ""}`}
          onClick={() => setSelectedDate(date)}
        >
          <div className={`text-sm font-medium mb-1 ${isToday ? "text-primary" : ""}`}>{day}</div>
          <div className="space-y-1">
            {events.slice(0, 2).map((event) => (
              <div
                key={event.id}
                className={`text-xs p-1 rounded text-white truncate ${event.color}`}
                title={`${event.title} - ${event.time}`}
              >
                {event.title}
              </div>
            ))}
            {events.length > 2 && <div className="text-xs text-muted-foreground">+{events.length - 2} more</div>}
          </div>
        </div>,
      )
    }

    return (
      <div className="grid grid-cols-7 gap-0">
        {/* Day headers */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="h-10 border border-border/50 bg-muted/50 flex items-center justify-center font-medium text-sm"
          >
            {day}
          </div>
        ))}
        {days}
      </div>
    )
  }

  const renderWeekView = () => {
    const startOfWeek = new Date(currentDate)
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay())

    const weekDays: Date[] = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      weekDays.push(date)
    }

    return (
      <div className="grid grid-cols-8 gap-0 border">
        {/* Time column header */}
        <div className="border-r bg-muted/50 p-2 font-medium text-sm">Time</div>

        {/* Day headers */}
        {weekDays.map((date) => (
          <div key={date.toISOString()} className="border-r bg-muted/50 p-2 text-center">
            <div className="font-medium text-sm">{date.toLocaleDateString("en-US", { weekday: "short" })}</div>
            <div className="text-lg font-bold">{date.getDate()}</div>
          </div>
        ))}

        {/* Time slots */}
        {Array.from({ length: 12 }, (_, hour) => {
          const time = hour + 8 // Start from 8 AM
          return (
            <div key={time} className="contents">
              <div className="border-r border-b p-2 text-sm text-muted-foreground">{time}:00</div>
              {weekDays.map((date) => {
                const dateString = formatDateString(date)
                const events = getEventsForDate(dateString).filter(
                  (event) => Number.parseInt(event.time.split(":")[0]) === time,
                )

                return (
                  <div key={`${dateString}-${time}`} className="border-r border-b p-1 h-16">
                    {events.map((event) => (
                      <div key={event.id} className={`text-xs p-1 rounded text-white mb-1 ${event.color}`}>
                        {event.title}
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    )
  }

  const renderDayView = () => {
    const dateString = formatDateString(currentDate)
    const events = getEventsForDate(dateString)

    return (
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold">
            {currentDate.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </h3>
        </div>

        <div className="space-y-2">
          {events.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No events scheduled for this day</div>
          ) : (
            events.map((event) => (
              <Card key={event.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <h4 className="font-semibold">{event.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {event.time} ({event.duration} min)
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {event.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {event.attendees.length === 1 && event.attendees[0] === "all"
                            ? "All team"
                            : `${event.attendees.length} attendees`}
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline">{event.type}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {view === "month" && renderMonthView()}
      {view === "week" && renderWeekView()}
      {view === "day" && renderDayView()}
    </div>
  )
}