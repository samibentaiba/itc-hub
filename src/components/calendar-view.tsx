"use client"

import { useState } from "react"
import { Clock, Users, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface CalendarViewProps {
  currentDate: Date
  view: string
}

const mockEvents = [
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

export function CalendarView({ currentDate, view }: CalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0]
  }

  const getEventsForDate = (date: string) => {
    return mockEvents.filter((event) => event.date === date)
  }

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
      const dateString = formatDate(date)
      const events = getEventsForDate(dateString)
      const isToday = dateString === formatDate(new Date())
      const isSelected = selectedDate && formatDate(selectedDate) === dateString

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

    const weekDays = []
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
                const dateString = formatDate(date)
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
    const dateString = formatDate(currentDate)
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
