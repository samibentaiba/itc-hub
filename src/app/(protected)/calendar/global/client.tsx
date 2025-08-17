// /calendar/global/client.tsx

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useGlobalCalendarPage } from "./hook";
import type { GlobalEvent } from "./types";
import GlobalCalendarView from "./_components/global-calendar-view";
import GlobalCalendarSidebar from "./_components/global-calendar-sidebar";
import EventDetailsDialog from "./_components/event-details-dialog";

interface GlobalCalendarClientPageProps {
  initialGlobalEvents: GlobalEvent[];
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
                  {/* --- NAVIGATION BUTTONS --- */}
                  {/* These buttons call the smart `navigate` function from the hook. */}
                  {/* This function's behavior changes based on the current `view` state. */}
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