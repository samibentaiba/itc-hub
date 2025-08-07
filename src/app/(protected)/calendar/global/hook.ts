// /calendar/global/hook.ts

import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import type { GlobalEvent, EventFormData, LoadingAction } from "./types";
import { formatDate } from "./utils";

export const useGlobalCalendarPage = (initialGlobalEvents: GlobalEvent[]) => {
  const [allEvents, setAllEvents] = useState<GlobalEvent[]>(initialGlobalEvents);
  const [currentDate, setCurrentDate] = useState(new Date("2025-08-01"));
  const [view, setView] = useState<"month" | "week" | "day">("month");
  const [showNewEvent, setShowNewEvent] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<GlobalEvent | null>(null);
  const [loadingAction, setLoadingAction] = useState<LoadingAction>(null);
  const [filterType, setFilterType] = useState<string>("all");
  const { toast } = useToast();

  const filteredEvents = useMemo(() => {
    if (filterType === "all") return allEvents;
    return allEvents.filter(event => event.type === filterType);
  }, [allEvents, filterType]);

  /**
   * --- CONTEXT-AWARE NAVIGATION ---
   * This is the flexible navigation function. It intelligently changes its
   * behavior based on the current `view` state (the selected filter).
   * - In 'month' view, it moves by one month.
   * - In 'week' view, it moves by 7 days.
   * - In 'day' view, it moves by a single day.
   */
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

  const handleAddEvent = async (formData: EventFormData) => {
    setLoadingAction("add-event");
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const newEvent: GlobalEvent = {
        id: `ge${allEvents.length + 1}`,
        title: formData.title,
        description: formData.description,
        date: new Date(formData.date),
        time: formData.time,
        duration: "60",
        type: formData.type,
        location: formData.location,
        organizer: "Current User",
        attendees: 0,
        isRecurring: formData.isRecurring || false,
      };
      setAllEvents(prev => [...prev, newEvent]);
      toast({ title: "Event created successfully!" });
      setShowNewEvent(false);
    } catch (error) {
      toast({ title: "Error", description: "Failed to create event.", variant: "destructive" });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleExportCalendar = async () => {
    setLoadingAction("export");
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const dataStr = JSON.stringify({ events: allEvents, exportDate: new Date().toISOString() }, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `global-calendar-export.json`;
      link.click();
      URL.revokeObjectURL(url);
      toast({ title: "Calendar exported" });
    } catch (error) {
      toast({ title: "Export Failed", variant: "destructive" });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleRefreshCalendar = async () => {
    setLoadingAction("refresh");
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({ title: "Calendar refreshed" });
    } catch (error) {
      toast({ title: "Refresh Failed", variant: "destructive" });
    } finally {
      setLoadingAction(null);
    }
  };

  return {
    currentDate,
    view,
    showNewEvent,
    selectedEvent,
    filteredEvents,
    loadingAction,
    filterType,
    setView,
    setShowNewEvent,
    setSelectedEvent,
    formatDate: (date: Date) => formatDate(date, view),
    navigate,
    handleAddEvent,
    handleExportCalendar,
    handleRefreshCalendar,
    handleDayClick,
    setFilterType,
  };
};
