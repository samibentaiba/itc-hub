// /calendar/global/hook.ts

"use client";

import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  formatDate,
  getDaysInMonth,
  getFirstDayOfMonth,
  formatDateString,
} from "./utils";
import { Event } from "@prisma/client";

export type CalendarViewType = "month" | "week" | "day";

export function useGlobalCalendar(
  initialEvents: Event[],
  initialUpcomingEvents: any[]
) {
  const { toast } = useToast();
  const [events, setEvents] = useState(initialEvents);
  const [upcomingEvents, setUpcomingEvents] = useState(initialUpcomingEvents);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarViewType>("month");

  const handleSetView = (newView: CalendarViewType) => {
    setView(newView);
  };

  const handleNavigate = (direction: "prev" | "next") => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      if (view === "month") {
        newDate.setMonth(newDate.getMonth() + (direction === "prev" ? -1 : 1));
      } else if (view === "week") {
        newDate.setDate(newDate.getDate() + (direction === "prev" ? -7 : 7));
      } else {
        newDate.setDate(newDate.getDate() + (direction === "prev" ? -1 : 1));
      }
      return newDate;
    });
  };

  const memoizedEvents = useMemo(() => {
    return events.map((e) => ({
      ...e,
      date: new Date(e.date),
    }));
  }, [events]);

  return {
    currentDate,
    view,
    events: memoizedEvents,
    upcomingEvents,
    setView: handleSetView,
    onNavigate: handleNavigate,
    formatDate,
    getDaysInMonth,
    getFirstDayOfMonth,
    formatDateString,
  };
}
