// /calendar/global/client.tsx

"use client";
import React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Users,
  MapPin,
} from "lucide-react";
import { format } from "date-fns";
import { useGlobalCalendar } from "./hook";
import { Event } from "@prisma/client";
import {
  getDaysInMonth,
  getFirstDayOfMonth,
  formatDateString,
  formatDate,
} from "./utils";

interface GlobalCalendarClientPageProps {
  initialEvents: Event[];
  initialUpcomingEvents: any[];
  availableWorkspaces: { id: string; name: string; type: string }[];
}

// Global Calendar Sidebar Component
interface GlobalCalendarSidebarProps {
  upcomingEvents: any[];
  allEvents: Event[];
  onEventClick: (event: Event | null) => void;
}

function GlobalCalendarSidebar({
  upcomingEvents,
  onEventClick,
  allEvents,
}: GlobalCalendarSidebarProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
          <CardDescription>Next 5 scheduled events</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {upcomingEvents.map((event) => (
            <div
              key={event.id}
              className="border rounded-lg p-3 hover:bg-accent/50 transition-colors cursor-pointer"
              onClick={() =>
                onEventClick(allEvents.find((e) => e.id === event.id) || null)
              }
            >
              <h4 className="font-medium">{event.title}</h4>
              <p className="text-sm text-muted-foreground">
                {format(new Date(event.date), "MMM dd, yyyy")}
              </p>
              <div className="flex items-center justify-between mt-2">
                <Badge variant="secondary" className="capitalize">
                  {event.type}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

// Event Details Dialog Component
interface EventDetailsDialogProps {
  event: Event | null;
  onClose: () => void;
}

function EventDetailsDialog({ event, onClose }: EventDetailsDialogProps) {
  if (!event) return null;
  return (
    <Dialog open={!!event} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {event.title}
          </DialogTitle>
          <DialogDescription className="mt-1">
            <Badge variant="outline" className="capitalize">
              {event.type}
            </Badge>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-muted-foreground">{event.description}</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(event.date), "PPP")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{event.location}</span>
            </div>
          </div>
        </div>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export default function GlobalCalendarClientPage({
  initialEvents,
  initialUpcomingEvents,
}: GlobalCalendarClientPageProps) {
  const { currentDate, view, events, upcomingEvents, setView, onNavigate } =
    useGlobalCalendar(initialEvents, initialUpcomingEvents);
  const [selectedEvent, setSelectedEvent] = React.useState<Event | null>(null);

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Global Calendar</h1>
            <p className="text-muted-foreground">
              Community-wide events and important dates.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={view}
              onValueChange={(value) =>
                setView(value as "month" | "week" | "day")
              }
            >
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
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Calendar className="h-5 w-5" />
                    {formatDate(currentDate, view)}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onNavigate("prev")}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onNavigate("next")}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CalendarGrid
                  currentDate={currentDate}
                  events={events}
                  onSelectEvent={setSelectedEvent}
                />
              </CardContent>
            </Card>
          </div>

          <GlobalCalendarSidebar
            upcomingEvents={upcomingEvents}
            allEvents={events}
            onEventClick={setSelectedEvent}
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

function CalendarGrid({
  currentDate,
  events,
  onSelectEvent,
}: {
  currentDate: Date;
  events: Event[];
  onSelectEvent: (event: Event) => void;
}) {
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(
      <div
        key={`empty-${i}`}
        className="h-24 border-t border-r border-border/50"
      ></div>
    );
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    const dateString = formatDateString(date);
    const dayEvents = events.filter(
      (event) => formatDateString(new Date(event.date)) === dateString
    );
    const isToday = dateString === formatDateString(new Date());

    days.push(
      <div
        key={day}
        className={`h-24 border-t border-r border-border/50 p-1.5 space-y-1 overflow-hidden cursor-pointer hover:bg-accent/50 ${
          isToday ? "bg-primary/10" : ""
        }`}
      >
        <div
          className={`text-xs font-medium ${
            isToday ? "text-primary font-bold" : "text-muted-foreground"
          }`}
        >
          {day}
        </div>
        {dayEvents.slice(0, 2).map((event) => (
          <div
            key={event.id}
            className={`text-white text-[10px] p-1 rounded truncate ${
              (event as any).color
            }`}
            title={event.title}
            onClick={(e) => {
              e.stopPropagation();
              onSelectEvent(event);
            }}
          >
            {event.title}
          </div>
        ))}
        {dayEvents.length > 2 && (
          <div className="text-xs text-muted-foreground">
            +{dayEvents.length - 2} more
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-7 border-l border-b border-border/50">
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
        <div
          key={day}
          className="h-10 border-t border-r border-border/50 bg-muted/50 flex items-center justify-center font-medium text-sm"
        >
          {day}
        </div>
      ))}
      {days}
    </div>
  );
}
