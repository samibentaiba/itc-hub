// /calendar/client.tsx

"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, ChevronLeft, ChevronRight, Filter, Users, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import { useCalendarPage } from "./hook";
import type { CalendarLocalEvent, CalendarUpcomingEvent } from "../types";
import type { EventFormData } from "./types";

interface CalendarClientPageProps {
  initialEvents: CalendarLocalEvent[];
  initialUpcomingEvents: CalendarUpcomingEvent[];
}

// Calendar Sidebar Component
interface CalendarSidebarProps {
  upcomingEvents: CalendarUpcomingEvent[];
  allEvents: CalendarLocalEvent[];
  filterType: string;
  onFilterChange: (type: string) => void;
  onNewEventClick: () => void;
  onEventClick: (event: CalendarLocalEvent | null) => void;
}

function CalendarSidebar({ upcomingEvents, allEvents, filterType, onFilterChange, onNewEventClick, onEventClick }: CalendarSidebarProps) {
  const eventTypes = ["all", ...Array.from(new Set(allEvents.map(e => e.type)))];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
            <Link href="/calendar/global">
              <Calendar className="h-4 w-4 mr-2" />
              Global Calendar
            </Link>
          </Button>

          <Select value={filterType} onValueChange={onFilterChange}>
            <SelectTrigger className="w-full justify-start bg-transparent">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter Events" />
            </SelectTrigger>
            <SelectContent>
              {eventTypes.map(type => (
                <SelectItem key={type} value={type} className="capitalize">
                  {type === 'all' ? 'All Events' : type.replace('-', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
          <CardDescription>Your next scheduled events.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {upcomingEvents.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No upcoming events
            </p>
          ) : (
            upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="border rounded-lg p-3 hover:bg-accent/50 transition-colors cursor-pointer"
                onClick={() => onEventClick(allEvents.find(e => e.id === event.id) || null)}
              >
                <h4 className="font-medium">{event.title}</h4>
                <p className="text-sm text-muted-foreground">{event.date}</p>
                <div className="flex items-center justify-between mt-2">
                  <Badge variant="secondary" className="capitalize">
                    {event.type.replace('-', ' ')}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {event.attendees}
                  </span>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Calendar View Component
interface CalendarViewProps {
  currentDate: Date;
  view: "month" | "week" | "day";
  events: CalendarLocalEvent[];
  setSelectedEvent: (event: CalendarLocalEvent | null) => void;
  handleDayClick: (date: Date) => void;
  getDaysInMonth: (date: Date) => number;
  getFirstDayOfMonth: (date: Date) => number;
  formatDateString: (date: Date) => string;
}

function CalendarView({ currentDate, view, events, setSelectedEvent, handleDayClick, getDaysInMonth, getFirstDayOfMonth, formatDateString }: CalendarViewProps) {

  const getEventsForDate = (date: string) => {
    return events.filter((event) => event.date === date);
  };

  const renderMonthView = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border-t border-r border-border/50"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateString = formatDateString(date);
      const dayEvents = getEventsForDate(dateString);
      const isToday = dateString === formatDateString(new Date());

      days.push(
        <div key={day} className={`h-24 border-t border-r border-border/50 p-1.5 space-y-1 overflow-hidden cursor-pointer hover:bg-accent/50 ${isToday ? "bg-primary/10" : ""}`} onClick={() => handleDayClick(date)}>
          <div className={`text-xs font-medium ${isToday ? "text-primary font-bold" : "text-muted-foreground"}`}>{day}</div>
          {dayEvents.slice(0, 2).map((event) => (
            <div key={event.id} className={`text-white text-[10px] p-1 rounded truncate ${event.color}`} title={event.title} onClick={(e) => { e.stopPropagation(); setSelectedEvent(event); }}>
              {event.title}
            </div>
          ))}
          {dayEvents.length > 2 && <div className="text-xs text-muted-foreground">+{dayEvents.length - 2} more</div>}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-7 border-l border-b border-border/50">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="h-10 border-t border-r border-border/50 bg-muted/50 flex items-center justify-center font-medium text-sm">{day}</div>
        ))}
        {days}
      </div>
    );
  };

  const renderWeekView = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    const weekDays: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDays.push(date);
    }

    return (
      <div className="grid grid-cols-8 border-t border-l border-b border-border/50">
        <div className="h-10 border-r border-border/50 bg-muted/50"></div>
        {weekDays.map(day => (
          <div key={day.toISOString()} className="h-14 border-r border-border/50 bg-muted/50 flex flex-col items-center justify-center font-medium text-sm cursor-pointer" onClick={() => handleDayClick(day)}>
            <span>{day.toLocaleDateString('en-US', { weekday: 'short' })}</span>
            <span className={`text-lg font-bold ${formatDateString(day) === formatDateString(new Date()) ? 'text-primary' : ''}`}>{day.getDate()}</span>
          </div>
        ))}
        {Array.from({ length: 16 }, (_, i) => i + 8).map(hour => (
          <div key={hour} className="contents">
            <div className="h-16 border-r border-t border-border/50 p-2 text-xs text-muted-foreground text-center">{`${hour}:00`}</div>
            {weekDays.map(day => {
              const dayEvents = getEventsForDate(formatDateString(day)).filter(e => {
                const eventHour = parseInt(e.time.split(':')[0]);
                return eventHour === hour;
              });
              return (
                <div key={`${hour}-${day.toISOString()}`} className="h-16 border-r border-t border-border/50 p-1 space-y-1 overflow-hidden">
                  {dayEvents.slice(0, 2).map(event => (
                    <div key={event.id} className={`text-white text-[10px] p-1 rounded truncate cursor-pointer ${event.color}`} title={event.title} onClick={() => setSelectedEvent(event)}>
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && <div className="text-xs text-muted-foreground text-center">...more</div>}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  const renderDayView = () => {
    const dayToRender = currentDate;
    const dateString = formatDateString(dayToRender);
    const dayEvents = getEventsForDate(dateString).sort((a, b) => a.time.localeCompare(b.time));

    return (
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-xl font-semibold">{dayToRender.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</h3>
        </div>
        <div className="space-y-3">
          {dayEvents.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">No events scheduled for this day.</div>
          ) : (
            dayEvents.map((event) => (
              <Card key={event.id} className="hover:bg-accent/50 transition-colors cursor-pointer" onClick={() => setSelectedEvent(event)}>
                <CardContent className="p-4 flex items-start gap-4">
                  <div className={`w-1.5 h-16 rounded-full ${event.color}`}></div>
                  <div className="flex-1 space-y-1">
                    <h4 className="font-semibold">{event.title}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{event.time} ({event.duration} min)</span>
                      <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" />{event.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      {Array.isArray(event.attendees) ? event.attendees.join(', ') : event.attendees}
                    </div>
                  </div>
                  <Badge variant="outline" className="capitalize">{event.type.replace('-', ' ')}</Badge>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    );
  };

  switch (view) {
    case "month": return renderMonthView();
    case "week": return renderWeekView();
    case "day": return renderDayView();
    default: return renderMonthView();
  }
}

// Create Event Dialog Component
interface CreateEventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  createEvent: (formData: EventFormData) => Promise<boolean>;
  isLoading: boolean;
}

function CreateEventDialog({ isOpen, onClose, createEvent, isLoading }: CreateEventDialogProps) {
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    time: "",
    duration: "60",
    type: "meeting",
    location: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await createEvent(formData);
    if (success) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>
            <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label htmlFor="date">Date</Label><Input id="date" type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required /></div>
            <div className="space-y-2"><Label htmlFor="time">Time</Label><Input id="time" type="time" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} required /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Duration</Label><Select value={formData.duration} onValueChange={(v) => setFormData({ ...formData, duration: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="30">30 min</SelectItem><SelectItem value="60">1 hour</SelectItem><SelectItem value="90">1.5 hours</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label>Type</Label><Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="meeting">Meeting</SelectItem><SelectItem value="review">Review</SelectItem><SelectItem value="planning">Planning</SelectItem><SelectItem value="workshop">Workshop</SelectItem></SelectContent></Select></div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>{isLoading ? "Creating..." : "Create Event"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Event Details Dialog Component
interface EventDetailsDialogProps {
  event: CalendarLocalEvent | null;
  onClose: () => void;
}

function EventDetailsDialog({ event, onClose }: EventDetailsDialogProps) {
  if (!event) return null;

  return (
    <Dialog open={!!event} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold">{event.title}</DialogTitle>
              <DialogDescription className="mt-1">
                <Badge variant="outline" className="capitalize">{event.type.replace('-', ' ')}</Badge>
              </DialogDescription>
            </div>
            <div className={`w-4 h-4 rounded-full mt-2 ${event.color}`}></div>
          </div>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-muted-foreground">{event.description}</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{event.time} ({event.duration} min)</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{event.location}</span>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">Attendees</h4>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{Array.isArray(event.attendees) ? event.attendees.join(', ') : event.attendees}</span>
            </div>
          </div>
        </div>
        <Button variant="outline" onClick={onClose}>Close</Button>
      </DialogContent>
    </Dialog>
  );
}

/**
 * The main client component for the calendar. It assembles the UI from
 * smaller, dedicated components and provides them with state and logic
 * from the useCalendarPage hook.
 */
export default function CalendarClientPage({ initialEvents, initialUpcomingEvents }: CalendarClientPageProps) {
  const {
    // State
    currentDate,
    view,
    showNewEvent,
    selectedEvent,
    filteredEvents,
    isLoading,
    filterType,

    // State Setters & Event Handlers
    setView,
    setShowNewEvent,
    setSelectedEvent,
    formatDate,
    navigate,
    createEvent,
    setFilterType,
    handleDayClick,

    // Utilities
    getDaysInMonth,
    getFirstDayOfMonth,
    formatDateString,
  } = useCalendarPage(initialEvents, initialUpcomingEvents);

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Calendar</h1>
            <p className="text-muted-foreground">View your Personal ITC-hub calendar</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={view} onValueChange={(value) => setView(value as "month" | "week" | "day")}>
              <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="day">Day</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          {/* Main Calendar View */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Calendar className="h-5 w-5" />
                    {formatDate(currentDate)}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => navigate("prev")}><ChevronLeft className="h-4 w-4" /></Button>
                    <Button variant="outline" size="icon" onClick={() => navigate("next")}><ChevronRight className="h-4 w-4" /></Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CalendarView
                  currentDate={currentDate}
                  view={view}
                  events={filteredEvents}
                  setSelectedEvent={setSelectedEvent}
                  handleDayClick={handleDayClick}
                  getDaysInMonth={getDaysInMonth}
                  getFirstDayOfMonth={getFirstDayOfMonth}
                  formatDateString={formatDateString}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <CalendarSidebar
            upcomingEvents={initialUpcomingEvents}
            allEvents={initialEvents}
            filterType={filterType}
            onFilterChange={setFilterType}
            onNewEventClick={() => setShowNewEvent(true)}
            onEventClick={setSelectedEvent}
          />
        </div>
      </div>

      {/* Dialogs */}
      <CreateEventDialog
        isOpen={showNewEvent}
        onClose={() => setShowNewEvent(false)}
        createEvent={createEvent}
        isLoading={isLoading}
      />
      <EventDetailsDialog
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </>
  );
}
