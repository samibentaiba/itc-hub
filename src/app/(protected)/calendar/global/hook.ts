// /calendar/global/hook.ts

"use client";

import { useState, useMemo } from "react";
import {
  formatDate,
  getDaysInMonth,
  getFirstDayOfMonth,
  formatDateString,
} from "./utils";
import { Event } from "@prisma/client";
import { CalendarViewType, UpcomingEvent, UseGlobalCalendarReturn } from "./types";

export function useGlobalCalendar(
  initialEvents: Event[],
  initialUpcomingEvents: UpcomingEvent[]
): UseGlobalCalendarReturn {
  const [events] = useState<Event[]>(initialEvents);
  const [upcomingEvents] = useState<UpcomingEvent[]>(initialUpcomingEvents);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [view, setView] = useState<CalendarViewType>("month");

  const handleSetView = (newView: CalendarViewType): void => {
    setView(newView);
  };

  const handleNavigate = (direction: "prev" | "next"): void => {
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

  const handleDayClick = (date: Date): void => {
    setCurrentDate(date);
    setView("day");
  };

  const memoizedEvents = useMemo<Event[]>(() => {
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
    handleDayClick,
    formatDate,
    getDaysInMonth,
    getFirstDayOfMonth,
    formatDateString,
  };
}