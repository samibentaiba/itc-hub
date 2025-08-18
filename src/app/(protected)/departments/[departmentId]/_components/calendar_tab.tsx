// src/app/(protected)/departments/[departmentId]/_components/calendar_tab.tsx
"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

// Import calendar-specific sub-components
import CalendarView from "./calendar/calendar-view";
import CalendarSidebar from "./calendar/calendar-sidebar";
import RequestEventDialog from "./calendar/request-event-dialog";
import EventDetailsDialog from "./calendar/event-details-dialog";

// Import necessary types
import type { Event, UpcomingEvent, EventFormData } from "../types";

// Define the props that this component will receive from its parent
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

/**
 * CalendarTab Component
 *
 * This component renders the entire UI for the "Department Calendar" tab,
 * including the main calendar view, the sidebar, and the dialogs for
 * creating and viewing events.
 */
export const CalendarTab = ({
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
}: CalendarTabProps) => {
  return (
    <>
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

        {/* Sidebar */}
        <CalendarSidebar
          upcomingEvents={upcomingEvents}
          allEvents={events}
          filterType={filterType}
          onFilterChange={onFilterChange}
          onNewEventClick={onNewEventClick}
          onEventClick={onSetSelectedEvent}
        />
      </div>

      {/* Dialogs are now part of this self-contained component */}
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
};
