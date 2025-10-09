// src/app/(protected)/teams/[teamId]/_sections/CalendarTab.tsx
"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { CalendarView } from "../_components/CalendarView";
import { CalendarSidebar } from "../_components/CalendarSideBar";
import { Event, UpcomingEvent } from "../types";

import { TabsContent } from "@/components/ui/tabs";

interface CalendarTabProps {
  currentDate: Date;
  teamId:string;
  calendarView: "month" | "week" | "day";
  onSetCalendarView: (view: "month" | "week" | "day") => void;
  onNavigateCalendar: (direction: "prev" | "next") => void;
  events: Event[];
  upcomingEvents: UpcomingEvent[];
  filterType: string;
  onFilterChange: (filter: string) => void;
  onNewEventClick: () => void;
  onSetSelectedEvent: (event: Event | null) => void;
  getDaysInMonth: (date: Date) => number;
  getFirstDayOfMonth: (date: Date) => number;
  formatDateString: (date: Date) => string;
  formatDate: (date: Date) => string;
}

export function CalendarTab({
  currentDate,
  calendarView,
  onSetCalendarView,
  teamId,
  onNavigateCalendar,
  events,
  upcomingEvents,
  filterType,
  onFilterChange,
  onNewEventClick,
  onSetSelectedEvent,
  getDaysInMonth,
  getFirstDayOfMonth,
  formatDateString,
  formatDate,
}: CalendarTabProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-4">
      <div className="lg:col-span-3">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <CalendarIcon className="h-5 w-5" />
                {formatDate(currentDate)}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Select value={calendarView} onValueChange={onSetCalendarView}>
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
            teamId={teamId}
              currentDate={currentDate}
              view={calendarView}
              events={events}
              setSelectedEvent={onSetSelectedEvent}
              handleDayClick={(date) => onSetSelectedEvent(null)} // or custom behavior
              getDaysInMonth={getDaysInMonth}
              getFirstDayOfMonth={getFirstDayOfMonth}
              formatDateString={formatDateString}
            />
          </CardContent>
        </Card>
      </div>
      <CalendarSidebar
      teamId={teamId}
        upcomingEvents={upcomingEvents}
        allEvents={events}
        filterType={filterType}
        onFilterChange={onFilterChange}
        onNewEventClick={onNewEventClick}
        onEventClick={onSetSelectedEvent}
      />
    </div>
  );
}
