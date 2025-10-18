"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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
import { AuthorizedComponent } from "@/hooks/use-authorization";
import type { Event, EventFormData, UpcomingEvent } from "@/types/calendar";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { CalendarSidebar } from "./CalendarSidebar";
import { CalendarView } from "./CalendarView";
import { EventDetailsDialog } from "./EventDetailsDialog";
import { RequestEventDialog } from "./RequestEventDialog";

interface CalendarTabProps {
  calendarView: "month" | "week" | "day";
  currentDate: Date;
  events: Event[];
  contextId: string;
  contextType: "department" | "team";
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
  createEvent: (
    data: EventFormData & { id?: number | string }
  ) => Promise<boolean>;
  handleEditEvent: (event: Event) => void;
  handleDeleteEvent: (event: Event) => void;
  setShowNewEventDialog: (show: boolean) => void;
  setSelectedEvent: (event: Event | null) => void;
}

export function CalendarTab({
  calendarView,
  currentDate,
  events,
  contextId,
  contextType,
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
                    onValueChange={(v) =>
                      onSetCalendarView(v as "month" | "week" | "day")
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
              />
            </CardContent>
          </Card>
        </div>

        <CalendarSidebar
          upcomingEvents={upcomingEvents}
          allEvents={events}
          filterType={filterType}
          contextType={contextType}
          contextId={contextId}
          onFilterChange={onFilterChange}
          onNewEventClick={onNewEventClick}
          onEventClick={onSetSelectedEvent}
        />
      </div>
      <AuthorizedComponent
        departmentId={contextType === "department" ? contextId : undefined}
        teamId={contextType === "team" ? contextId : undefined}
        action="manage"
        requiresManager={true}
      >
        <RequestEventDialog
          isOpen={showNewEventDialog}
          onClose={() => setShowNewEventDialog(false)}
          onSubmit={createEvent}
          isLoading={isCalendarLoading}
          initialData={selectedEvent}
        />
      </AuthorizedComponent>
      <EventDetailsDialog
        contextType={contextType}
        contextId={contextId}
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
      />
    </>
  );
}
