"use client";

import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarView } from "./CalendarView";
import { CalendarSidebar } from "./CalendarSidebar";
import { RequestEventDialog } from "./RequestEventDialog";
import { EventDetailsDialog } from "./EventDetailsDialog";

// ===================================
// API Data Structure for Calendar
// ===================================

/**
 * The API endpoint for fetching the events of a department should look like:
 * GET /api/departments/{departmentId}/events
 *
 * The response should be an array of Event objects.
 *
 * The API endpoints for creating, updating, and deleting events are handled in the `useCalendar` hook.
 * POST /api/departments/{departmentId}/events
 * PUT /api/departments/{departmentId}/events/{eventId}
 * DELETE /api/departments/{departmentId}/events/{eventId}
 */

export interface Event {
  id: any;
  title: string;
  description: string;
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:MM"
  duration: number; // in minutes
  type: "meeting" | "review" | "planning" | "workshop";
  attendees: string[];
  location: string;
  color: string;
}

export interface UpcomingEvent {
  id: any;
  title: string;
  date: string;
  type: string;
  attendees: number;
}

export interface EventFormData {
  title: string;
  description?: string;
  date: string;
  time: string;
  duration: string;
  type: "meeting" | "review" | "planning" | "workshop";
  location?: string;
}

// Example of what the API should return for GET /api/departments/{departmentId}/events:
const mockEventsData: Event[] = [
  {
    id: 1,
    title: "Q4 Planning Session",
    description: "Finalize the roadmap for the last quarter of the year.",
    date: "2025-10-15",
    time: "10:00",
    duration: 120,
    type: "planning",
    attendees: ["Alice Johnson", "Bob Williams", "Charlie Brown"],
    location: "Conference Room A",
    color: "bg-blue-500",
  },
  {
    id: 2,
    title: "Frontend Tech-Talk",
    description: "A session on the latest trends in frontend development.",
    date: "2025-10-20",
    time: "14:00",
    duration: 60,
    type: "workshop",
    attendees: ["Alice Johnson", "Frontend Team"],
    location: "Virtual",
    color: "bg-green-500",
  },
];

// ===================================
// Component Implementation
// ===================================

interface CalendarTabProps {
  calendarView: "month" | "week" | "day";
  currentDate: Date;
  events: Event[];
  upcomingEvents: UpcomingEvent[];
  filterType: string;
  selectedEvent: Event | null;
  isCalendarLoading: boolean;
  showNewEventDialog: boolean;
  onSetCalendarView: (view: "month" | "week" | "day") => void;
  onNavigateCalendar: (direction: "prev" | "next") => void;
  onSetSelectedEvent: (event: Event | null) => void;
  onNewEventClick: () => void;
  onFilterChange: (type: string) => void;
  onDayClick: (date: Date) => void;
  formatDate: (date: Date) => string;
  getDaysInMonth: (date: Date) => number;
  getFirstDayOfMonth: (date: Date) => number;
  formatDateString: (date: Date) => string;
  createEvent: (data: EventFormData & { id?: number | string }) => Promise<boolean>;
  handleEditEvent: (event: Event) => void;
  handleDeleteEvent: (event: Event) => void;
  setShowNewEventDialog: (show: boolean) => void;
  setSelectedEvent: (event: Event | null) => void;
}

export function CalendarTab({
  calendarView,
  currentDate,
  events,
  upcomingEvents,
  filterType,
  selectedEvent,
  isCalendarLoading,
  showNewEventDialog,
  onSetCalendarView,
  onNavigateCalendar,
  onSetSelectedEvent,
  onNewEventClick,
  onFilterChange,
  onDayClick,
  formatDate,
  getDaysInMonth,
  getFirstDayOfMonth,
  formatDateString,
  createEvent,
  handleEditEvent,
  handleDeleteEvent,
  setShowNewEventDialog,
  setSelectedEvent,
}: CalendarTabProps) {
  return (
    <>
      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Calendar className="h-5 w-5" />
                  {formatDate(currentDate)}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Select
                    value={calendarView}
                    onValueChange={(v) => onSetCalendarView(v as "month" | "week" | "day")}
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
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onNavigateCalendar("prev")}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onNavigateCalendar("next")}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CalendarView
                currentDate={currentDate}
                view={calendarView}
                events={events}
                setSelectedEvent={onSetSelectedEvent}
                handleDayClick={onDayClick}
                getDaysInMonth={getDaysInMonth}
                getFirstDayOfMonth={getFirstDayOfMonth}
                formatDateString={formatDateString}
              />
            </CardContent>
          </Card>
        </div>

        <CalendarSidebar
          upcomingEvents={upcomingEvents}
          allEvents={events}
          filterType={filterType}
          onFilterChange={onFilterChange}
          onNewEventClick={onNewEventClick}
          onEventClick={onSetSelectedEvent}
        />
      </div>

      <RequestEventDialog
        isOpen={showNewEventDialog}
        onClose={() => setShowNewEventDialog(false)}
        onSubmit={createEvent}
        isLoading={isCalendarLoading}
        initialData={selectedEvent}
      />
      <EventDetailsDialog
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
      />
    </>
  );
}