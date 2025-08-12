// /calendar/client.tsx

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useCalendarPage } from "./hook";
import type { CalendarLocalEvent, CalendarUpcomingEvent } from "../types";
import CalendarView from "./_components/calendar-view";
import CreateEventDialog from "./_components/create-event-dialog";
import EventDetailsDialog from "./_components/event-details-dialog";
import CalendarSidebar from "./_components/calendar-sidebar";

interface CalendarClientPageProps {
  initialEvents: CalendarLocalEvent[];
  initialUpcomingEvents: CalendarUpcomingEvent[];
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
