import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, transformApiResponse } from "../utils";
import type { Event, UpcomingEvent, EventFormData } from "../types";

/**
 * @hook useCalendar
 * @description Manages all state and logic for the calendar and events.
 * @param {Event[]} initialEvents - The initial list of events.
 * @returns {object} - Calendar state, event data, and action handlers.
 */
export const useCalendar = (initialEvents: Event[]) => {
  const { toast } = useToast();
  const [allEvents, setAllEvents] = useState<Event[]>(initialEvents);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState<"month" | "week" | "day">("month");
  const [showNewEventDialog, setShowNewEventDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isCalendarLoading, setIsCalendarLoading] = useState(false);
  const [calendarFilterType, setCalendarFilterType] = useState<string>("all");

  const upcomingEvents = useMemo(() => {
    const now = new Date();
    return allEvents
      .map(event => ({ ...event, dateTime: new Date(`${event.date}T${event.time}`) }))
      .filter(event => event.dateTime >= now)
      .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime())
      .slice(0, 5)
      .map((event): UpcomingEvent => ({
        id: event.id,
        title: event.title,
        date: new Date(`${event.date}T${event.time}`).toLocaleString(),
        type: event.type,
        attendees: event.attendees.length,
      }));
  }, [allEvents]);

  const filteredEvents = useMemo(() => {
    if (calendarFilterType === "all") return allEvents;
    return allEvents.filter((event) => event.type === calendarFilterType);
  }, [allEvents, calendarFilterType]);

  const navigateCalendar = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      const d = direction === "prev" ? -1 : 1;
      if (calendarView === "month") newDate.setMonth(prev.getMonth() + d);
      if (calendarView === "week") newDate.setDate(prev.getDate() + (d * 7));
      if (calendarView === "day") newDate.setDate(prev.getDate() + d);
      return newDate;
    });
  };

  const handleDayClick = (date: Date) => {
    setCurrentDate(date);
    setCalendarView("day");
  };

  const createEvent = async (data: EventFormData & { id?: string }): Promise<boolean> => {
    const isEdit = !!data.id;
    const url = isEdit ? `/api/admin/events/${data.id}` : "/api/admin/events";
    const method = isEdit ? "PUT" : "POST";
    setIsCalendarLoading(true);

    try {
      const savedEventData = await apiRequest(url, { method, body: JSON.stringify(data) });
      const savedEvent = transformApiResponse(savedEventData, 'event');

      if (isEdit) {
        setAllEvents((prev) => prev.map((e) => (e.id === savedEvent.id ? savedEvent : e)));
      } else {
        setAllEvents((prev) => [...prev, savedEvent]);
      }
      toast({ title: isEdit ? "Event Updated" : "Event Created" });
      return true;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error Creating/Updating Event";
      toast({ title: "Error Creating/Updating Event", description: message, variant: "destructive" });
      return false;
    } finally {
      setIsCalendarLoading(false);
    }
  };

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setShowNewEventDialog(true);
  };

  const handleDeleteEvent = async (event: Event) => {
    setIsCalendarLoading(true);
    const originalEvents = allEvents;
    setAllEvents((prev) => prev.filter((e) => e.id !== event.id));
    setSelectedEvent(null);
    try {
      await apiRequest(`/api/admin/events/${event.id}`, { method: "DELETE" });
      toast({ title: "Event Deleted", description: `"${event.title}" has been removed.` });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error Deleting Event";
      toast({ title: "Error Deleting Event", description: message, variant: "destructive" });
      setAllEvents(originalEvents);
    } finally {
      setIsCalendarLoading(false);
    }
  };

  const formatDate = (date: Date, view: "month" | "week" | "day"): string => {
    if (view === 'day') return date.toLocaleDateString("en-US", { weekday: 'long', month: "long", day: "numeric", year: "numeric" });
    if (view === 'week') {
      const start = new Date(date);
      start.setDate(date.getDate() - date.getDay());
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      return `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
    }
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };
  const getDaysInMonth = (date: Date): number => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date: Date): number => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const formatDateString = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };


  return {
    allEvents,
    setAllEvents,
    view: calendarView,
    currentDate,
    events: filteredEvents,
    upcomingEvents,
    showNewEventDialog,
    selectedEvent,
    isLoading: isCalendarLoading,
    filterType: calendarFilterType,
    actions: {
      setView: setCalendarView,
      navigate: navigateCalendar,
      createEvent,
      setSelectedEvent,
      setShowNewEventDialog,
      setFilterType: setCalendarFilterType,
      handleDayClick,
      handleEditEvent,
      handleDeleteEvent,
    },
    utils: {
      formatDate: (date: Date) => formatDate(date, calendarView),
      getDaysInMonth,
      getFirstDayOfMonth,
      formatDateString,
    },
  };
};