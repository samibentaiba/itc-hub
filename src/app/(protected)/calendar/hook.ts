// /calendar/hook.ts

import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import type { CalendarLocalEvent, CalendarUpcomingEvent } from "../types";
import type { EventFormData } from "./types";
import { formatDate, getDaysInMonth, getFirstDayOfMonth, formatDateString } from "./utils";

/**
 * A custom hook to manage the state and logic for the calendar page.
 * It accepts initial data fetched from the server to hydrate its state.
 * @param initialEvents - The initial list of events from the server.
 * @param initialUpcomingEvents - The initial list of upcoming events.
 */
export const useCalendarPage = (
  initialEvents: CalendarLocalEvent[],
  initialUpcomingEvents: CalendarUpcomingEvent[]
) => {
  const [allEvents, setAllEvents] = useState<CalendarLocalEvent[]>(initialEvents);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"month" | "week" | "day">("month");
  const [showNewEvent, setShowNewEvent] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarLocalEvent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filterType, setFilterType] = useState<string>("all");
  const { toast } = useToast();

  const upcomingEvents = initialUpcomingEvents;

  const filteredEvents = useMemo(() => {
    if (filterType === "all") {
      return allEvents;
    }
    return allEvents.filter(event => event.type === filterType);
  }, [allEvents, filterType]);

  const navigate = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      switch (view) {
        case "month":
          newDate.setDate(1);
          newDate.setMonth(direction === "prev" ? prev.getMonth() - 1 : prev.getMonth() + 1);
          break;
        case "week":
          newDate.setDate(prev.getDate() + (direction === "prev" ? -7 : 7));
          break;
        case "day":
          newDate.setDate(prev.getDate() + (direction === "prev" ? -1 : 1));
          break;
      }
      return newDate;
    });
  };

  const handleDayClick = (date: Date) => {
    setCurrentDate(date);
    setView("day");
  };

  const createEvent = async (formData: EventFormData) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const newEvent: CalendarLocalEvent = {
        id: allEvents.length + 1,
        title: formData.title,
        description: formData.description,
        date: formData.date,
        time: formData.time,
        duration: parseInt(formData.duration),
        type: formData.type,
        attendees: ["You"],
        location: formData.location || "Virtual",
        color: "bg-blue-500",
      };

      setAllEvents(prev => [...prev, newEvent]);
      setFilterType("all");

      toast({
        title: "Event Created",
        description: `"${formData.title}" has been added to your calendar.`,
      });
      setIsLoading(false);
      return true;
    } catch {
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
      return false;
    }
  };

  return {
    // State
    currentDate,
    view,
    showNewEvent,
    selectedEvent,
    filteredEvents,
    upcomingEvents,
    isLoading,
    filterType,
    
    // State Setters
    setCurrentDate,
    setView,
    setShowNewEvent,
    setSelectedEvent,
    setFilterType,

    // Event Handlers & Logic
    navigate,
    createEvent,
    handleDayClick,

    // Utilities (passed through for convenience)
    formatDate: (date: Date) => formatDate(date, view),
    getDaysInMonth,
    getFirstDayOfMonth,
    formatDateString,
  };
};