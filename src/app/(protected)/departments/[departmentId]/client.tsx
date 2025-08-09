// src/app/(protected)/departments/[departmentId]/client.tsx

/**
 * client.tsx
 *
 * This is the main client component for the department view. It has been refactored
 * to be a "container" component. Its primary responsibilities are to manage state
 * via the `useDepartmentView` hook and to compose the UI by rendering smaller,
 * more focused presentational components.
 */
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDepartmentView } from "./hook";
import { Department } from "./types";
import { DepartmentHeader } from "./_components/department_header";
import { TicketsTab } from "./_components/tickets_tab";
import { TeamsTab } from "./_components/teams_tab";
import { MembersTab } from "./_components/members_tab"; // Import the new MembersTab component
import {
  Card,
  CardContent,
  CardDescription,
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

import CalendarView from "./_components/calendar/calendar-view";
import RequestEventDialog from "./_components/calendar/request-event-dialog";
import EventDetailsDialog from "./_components/calendar/event-details-dialog";
import CalendarSidebar from "./_components/calendar/calendar-sidebar";

interface DepartmentViewProps {
  departmentData: Department;
}

export function DepartmentView({ departmentData }: DepartmentViewProps) {
  // Use the custom hook to get all the necessary state and event handlers
  const {
    showNewTicket,
    setShowNewTicket,
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
  } = useDepartmentView({
    tickets: departmentData.tickets, // Pass tickets to the hook
    initialEvents: departmentData.events,
  });

  // Render the layout and pass props down to the child components
  return (
    <div className="space-y-6">
      <DepartmentHeader
        department={departmentData}
        showNewTicket={showNewTicket}
        onOpenChange={setShowNewTicket}
      />

      <Tabs defaultValue="tickets" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tickets">Long-term Tickets</TabsTrigger>
          <TabsTrigger value="calendar">Department Calendar</TabsTrigger>
          <TabsTrigger value="teams">Supervised Teams</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger> {/* Add Members Tab Trigger */}
        </TabsList>

        <TabsContent value="tickets">
          {/* Pass tickets directly to the tab */}
          <TicketsTab tickets={departmentData.tickets} departmentId={departmentData.id} />
        </TabsContent>

        <TabsContent value="calendar">
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
                        onValueChange={(v) => onSetCalendarView(v as any)}
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
        </TabsContent>

        <TabsContent value="teams">
          <TeamsTab teams={departmentData.teams} />
        </TabsContent>
        
        {/* Add Members Tab Content */}
        <TabsContent value="members">
          <MembersTab members={departmentData.members} />
        </TabsContent>
      </Tabs>
      <RequestEventDialog
        isOpen={showNewEventDialog}
        onClose={() => setShowNewEventDialog(false)}
        onSubmit={createEvent}
        isLoading={isCalendarLoading}
      />
      <EventDetailsDialog
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
      />
    </div>
  );
}