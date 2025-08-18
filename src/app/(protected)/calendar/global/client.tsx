// /calendar/global/client.tsx

"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, ChevronLeft, ChevronRight, Clock, Users, MapPin } from "lucide-react";
import { format } from "date-fns";
import { useGlobalCalendarPage } from "./hook";
import type { GlobalEvent, LoadingAction } from "./types";
import { getDaysInMonth, getFirstDayOfMonth, formatDateString, getEventTypeColor, getEventTypeBadgeVariant } from "./utils";

interface GlobalCalendarClientPageProps {
  initialGlobalEvents: GlobalEvent[];
}

// Global Calendar Sidebar Component
interface GlobalCalendarSidebarProps {
  upcomingEvents: GlobalEvent[];
  allEvents: GlobalEvent[];
  filterType: string;
  loadingAction: LoadingAction;
  onFilterChange: (type: string) => void;
  onNewEventClick: () => void;
  onEventClick: (event: GlobalEvent | null) => void;
  onRefresh: () => void;
  onExport: () => void;
}

function GlobalCalendarSidebar({ upcomingEvents, onEventClick }: GlobalCalendarSidebarProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Upcoming Events</CardTitle><CardDescription>Next 5 scheduled events</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="border rounded-lg p-3 hover:bg-accent/50 transition-colors cursor-pointer" onClick={() => onEventClick(event)}>
              <h4 className="font-medium">{event.title}</h4>
              <p className="text-sm text-muted-foreground">{format(new Date(event.date), "MMM dd, yyyy")} at {event.time}</p>
              <div className="flex items-center justify-between mt-2"><Badge variant="secondary" className="capitalize">{event.type}</Badge><span className="text-xs text-muted-foreground flex items-center gap-1"><Users className="h-3 w-3" />{event.attendees}</span></div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

// Global Calendar View Component
interface GlobalCalendarViewProps {
  currentDate: Date;
  view: "month" | "week" | "day";
  events: GlobalEvent[];
  onSelectEvent: (event: GlobalEvent) => void;
  onDayClick: (date: Date) => void;
}

function GlobalCalendarView({ currentDate, view, events, onSelectEvent, onDayClick }: GlobalCalendarViewProps) {

  const getEventsForDate = (date: string) => {
    return events.filter((event) => formatDateString(new Date(event.date)) === date);
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
        <div key={day} className={`h-24 border-t border-r border-border/50 p-1.5 space-y-1 overflow-hidden cursor-pointer hover:bg-accent/50 ${isToday ? "bg-primary/10" : ""}`} onClick={() => onDayClick(date)}>
          <div className={`text-xs font-medium ${isToday ? "text-primary font-bold" : "text-muted-foreground"}`}>{day}</div>
          {dayEvents.slice(0, 2).map((event) => (
            <div key={event.id} className={`text-white text-[10px] p-1 rounded truncate ${getEventTypeColor(event.type)}`} title={event.title} onClick={(e) => { e.stopPropagation(); onSelectEvent(event); }}>
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
        {/* Header row */}
        <div className="h-10 border-r border-border/50 bg-muted/50"></div>
        {weekDays.map(day => (
          <div key={day.toISOString()} className="h-14 border-r border-border/50 bg-muted/50 flex flex-col items-center justify-center font-medium text-sm cursor-pointer" onClick={() => onDayClick(day)}>
            <span>{day.toLocaleDateString('en-US', { weekday: 'short' })}</span>
            <span className={`text-lg font-bold ${formatDateString(day) === formatDateString(new Date()) ? 'text-primary' : ''}`}>{day.getDate()}</span>
          </div>
        ))}

        {/* Time slots */}
        {Array.from({ length: 24 }, (_, i) => i + 8).map(hour => (
          <div key={hour} className="contents">
            <div className="h-16 border-r border-t border-border/50 p-2 text-xs text-muted-foreground text-center">{`${hour}:00`}</div>
            {weekDays.map(day => {
              const dayEvents = getEventsForDate(formatDateString(day)).filter(e => parseInt(e.time.split(':')[0]) === hour);
              return (
                <div key={`${hour}-${day.toISOString()}`} className="h-16 border-r border-t border-border/50 p-1 space-y-1 overflow-hidden">
                  {dayEvents.slice(0, 2).map(event => (
                    <div key={event.id} className={`text-white text-[10px] p-1 rounded truncate cursor-pointer ${getEventTypeColor(event.type)}`} title={event.title} onClick={() => onSelectEvent(event)}>
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
    const dayEvents = getEventsForDate(formatDateString(currentDate)).sort((a, b) => a.time.localeCompare(b.time));
    return (
      <div className="space-y-4">
        <div className="space-y-3">
          {dayEvents.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">No events scheduled for this day.</div>
          ) : (
            dayEvents.map((event) => (
              <Card key={event.id} className="hover:bg-accent/50 transition-colors cursor-pointer" onClick={() => onSelectEvent(event)}>
                <CardContent className="p-4 flex items-start gap-4">
                  <div className={`w-1.5 h-16 rounded-full ${getEventTypeColor(event.type)}`}></div>
                  <div className="flex-1 space-y-1">
                    <h4 className="font-semibold">{event.title}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{event.time}</span>
                      <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" />{event.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      {event.attendees} attendees
                    </div>
                  </div>
                  <Badge variant={getEventTypeBadgeVariant(event.type)} className="capitalize">{event.type}</Badge>
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

// Event Details Dialog Component
interface EventDetailsDialogProps {
  event: GlobalEvent | null;
  onClose: () => void;
}

function EventDetailsDialog({ event, onClose }: EventDetailsDialogProps) {
  if (!event) return null;
  return (
    <Dialog open={!!event} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div><DialogTitle className="text-2xl font-bold">{event.title}</DialogTitle><DialogDescription className="mt-1"><Badge variant="outline" className="capitalize">{event.type}</Badge></DialogDescription></div>
            <div className={`w-4 h-4 rounded-full mt-2 ${getEventTypeColor(event.type)}`}></div>
          </div>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-muted-foreground">{event.description}</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2"><Calendar className="h-4 w-4" /><span>{format(new Date(event.date), "PPP")}</span></div>
            <div className="flex items-center gap-2"><Clock className="h-4 w-4" /><span>{event.time}</span></div>
            <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /><span>{event.location}</span></div>
            <div className="flex items-center gap-2"><Users className="h-4 w-4" /><span>{event.attendees} attendees</span></div>
          </div>
          <div><h4 className="font-medium mb-2">Organizer</h4><div className="flex items-center gap-2 text-sm"><Users className="h-4 w-4" /><span>{event.organizer}</span></div></div>
        </div>
        <Button variant="outline" onClick={onClose}>Close</Button>
      </DialogContent>
    </Dialog>
  );
}

export default function GlobalCalendarClientPage({ initialGlobalEvents = [] }: GlobalCalendarClientPageProps) {
  const {
    currentDate,
    view,
    selectedEvent,
    filteredEvents,
    loadingAction,
    filterType,
    setView,
    setShowNewEvent,
    setSelectedEvent,
    formatDate,
    navigate,
    handleExportCalendar,
    handleRefreshCalendar,
    handleDayClick,
    setFilterType,
  } = useGlobalCalendarPage(initialGlobalEvents);

  // Safely filter upcoming events
  const upcomingEvents = (initialGlobalEvents || [])
    .filter(event => {
      try {
        return new Date(event.date) > new Date();
      } catch {
        return false;
      }
    })
    .sort((a, b) => {
      try {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } catch {
        return 0;
      }
    })
    .slice(0, 5);

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Global Calendar</h1>
            <p className="text-muted-foreground">Community-wide events and important dates.</p>
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
                <GlobalCalendarView
                  currentDate={currentDate}
                  view={view}
                  events={filteredEvents}
                  onSelectEvent={setSelectedEvent}
                  onDayClick={handleDayClick}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <GlobalCalendarSidebar
            upcomingEvents={upcomingEvents}
            allEvents={initialGlobalEvents || []}
            filterType={filterType}
            loadingAction={loadingAction}
            onFilterChange={setFilterType}
            onNewEventClick={() => setShowNewEvent(true)}
            onEventClick={setSelectedEvent}
            onRefresh={handleRefreshCalendar}
            onExport={handleExportCalendar}
          />
        </div>
      </div>
      <EventDetailsDialog
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </>
  );
}
