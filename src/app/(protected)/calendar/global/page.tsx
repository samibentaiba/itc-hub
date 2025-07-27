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
import { ChevronLeft, ChevronRight, Plus, Users, Building2, Clock, Shield } from "lucide-react"
import { WorkspaceLayout } from "@/components/workspace-layout"
import { useGlobalCalendar } from "./hook"

export default function GlobalCalendarPage() {
  const {
    date,
    setDate,
    showNewEvent,
    formData,
    setFormData,
    setShowNewEvent,
    events,
    loading,
    getSelectedDateEvents,
    getUpcomingEvents,
    getCalendarEvents,
    handleCreateEvent,
    handleSubmit,
    getEventTypeColor,
  } = useGlobalCalendar()



  if (loading) return <div>Loading events...</div>

  return (
    <WorkspaceLayout>
      <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-red-500" />
              Global Calendar
            </h1>
            <p className="text-sm text-muted-foreground">
              ITC club-wide events, meetings, and important dates
            </p>
          </div>
          <Dialog open={showNewEvent} onOpenChange={setShowNewEvent}>
            <DialogTrigger asChild>
              <Button className="bg-red-600 hover:bg-red-700 w-full sm:w-auto text-sm">
                <Plus className="mr-2 h-4 w-4" />
                New Event
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-md mx-auto">
              <DialogHeader>
                <DialogTitle>Create Global Event</DialogTitle>
                <DialogDescription>Add a new event to the ITC global calendar</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="eventTitle" className="text-sm">
                    Event Title
                  </Label>
                  <Input
                    id="eventTitle"
                    placeholder="Enter event title..."
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eventDescription" className="text-sm">
                    Description
                  </Label>
                  <Textarea
                    id="eventDescription"
                    placeholder="Describe the event..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    className="text-sm min-h-[80px]"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="eventDate" className="text-sm">
                      Date
                    </Label>
                    <Input
                      id="eventDate"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="eventTime" className="text-sm">
                      Time
                    </Label>
                    <Input
                      id="eventTime"
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      required
                      className="text-sm"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="eventDuration" className="text-sm">
                      Duration
                    </Label>
                    <Input
                      id="eventDuration"
                      placeholder="e.g., 2 hours"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      required
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="eventLocation" className="text-sm">
                      Location
                    </Label>
                    <Input
                      id="eventLocation"
                      placeholder="Event location..."
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      required
                      className="text-sm"
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" className="text-sm bg-transparent" onClick={() => setShowNewEvent(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-red-600 hover:bg-red-700 text-sm">
                    Create Event
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="calendar" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="calendar" className="text-xs sm:text-sm">
              Calendar View
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="text-xs sm:text-sm">
              Upcoming Events
            </TabsTrigger>
            <TabsTrigger value="all" className="text-xs sm:text-sm">
              All Events
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="space-y-4">
            <div className="grid gap-4 lg:gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Calendar</CardTitle>
                  <CardDescription className="text-sm">Select a date to view events</CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border w-full"
                    modifiers={{
                      hasEvents: (date) => {
                        const dateKey = date.toDateString()
                        return !!getCalendarEvents()[dateKey]
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
                <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center">
                  <div className="flex-1">
                    <CardTitle className="text-lg sm:text-xl">
                      {date
                        ? `Events for ${date.toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}`
                        : "Select a date"}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {getSelectedDateEvents().length === 0
                        ? "No events scheduled for this date"
                        : `${getSelectedDateEvents().length} event${getSelectedDateEvents().length > 1 ? "s" : ""} scheduled`}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2 mt-4 sm:mt-0">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => date && setDate(new Date(date.setDate(date.getDate() - 1)))}
                      className="h-8 w-8"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => date && setDate(new Date(date.setDate(date.getDate() + 1)))}
                      className="h-8 w-8"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  {getSelectedDateEvents().length === 0 ? (
                    <div className="flex h-[200px] sm:h-[300px] items-center justify-center border rounded-md">
                      <p className="text-sm text-muted-foreground">No events scheduled for this date</p>
                    </div>
                  ) : (
                    <div className="space-y-3 sm:space-y-4 max-h-[300px] overflow-auto">
                      {getSelectedDateEvents().map((event) => (
                        <div key={event.id} className="border rounded-lg p-3 sm:p-4 hover:bg-accent/50 transition-colors">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-2">
                            <h3 className="font-semibold text-sm sm:text-base">{event.title}</h3>
                            <Badge className={`${getEventTypeColor(event.type)} text-xs`}>{event.type}</Badge>
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground mb-3">{event.description}</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {event.time} ({event.duration})
                            </div>
                            <div className="flex items-center gap-1">
                              <Building2 className="h-3 w-3" />
                              <span className="truncate">{event.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {event.attendees > 0 ? `${event.attendees} attendees` : "No attendees"}
                            </div>
                            <div className="truncate">Organized by {event.organizer}</div>
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
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Upcoming Events</CardTitle>
                <CardDescription className="text-sm">Next events in the ITC calendar</CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="space-y-3 sm:space-y-4">
                  {getUpcomingEvents().map((event) => (
                    <div key={event.id} className="border rounded-lg p-3 sm:p-4 hover:bg-accent/50 transition-colors">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-2">
                        <div>
                          <h3 className="font-semibold text-sm sm:text-base">{event.title}</h3>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {event.date.toLocaleDateString()} at {event.time}
                          </p>
                        </div>
                        <Badge className={`${getEventTypeColor(event.type)} text-xs`}>{event.type}</Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-3">{event.description}</p>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          <span className="truncate">{event.location}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {event.attendees > 0 ? `${event.attendees} attendees` : "No attendees"}
                        </span>
                        <span className="truncate">by {event.organizer}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">All Events</CardTitle>
                <CardDescription className="text-sm">Complete list of ITC events</CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="space-y-3 sm:space-y-4 max-h-[500px] overflow-auto">
                  {events
                    .sort((a, b) => a.date.getTime() - b.date.getTime())
                    .map((event) => (
                      <div key={event.id} className="border rounded-lg p-3 sm:p-4 hover:bg-accent/50 transition-colors">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-2">
                          <div>
                            <h3 className="font-semibold text-sm sm:text-base">{event.title}</h3>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              {event.date.toLocaleDateString()} at {event.time}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={`${getEventTypeColor(event.type)} text-xs`}>{event.type}</Badge>
                            {event.isRecurring && (
                              <Badge variant="outline" className="text-xs">
                                Recurring
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-3">{event.description}</p>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            <span className="truncate">{event.location}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {event.attendees > 0 ? `${event.attendees} attendees` : "No attendees"}
                          </span>
                          <span className="truncate">by {event.organizer}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </WorkspaceLayout>
  )
}
