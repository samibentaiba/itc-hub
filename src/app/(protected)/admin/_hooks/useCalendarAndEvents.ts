// /app/(protected)/admin/_hooks/useCalendarAndEvents.ts
import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { $Enums } from "@prisma/client";
// import EventType only as a type
type EventType = typeof $Enums.EventType[keyof typeof $Enums.EventType];
import { apiRequest } from "./useApiHelper";
import type { Event, UpcomingEvent, PendingEvent, EventFormData } from "../types";

const transformEvent = (item: Record<string, unknown>): Event => ({
  ...(item as Event),
  type: (item.type as string).toUpperCase() as EventType,
  attendees: (item.attendees as { name: string }[])?.map((a) => a.name) || [],
  color: (item.color as string) || '#3b82f6',
});


export const useCalendarAndEvents = (initialEvents: Event[], initialPendingEvents: PendingEvent[]) => {
  const { toast } = useToast();
  const [allEvents, setAllEvents] = useState<Event[]>(initialEvents.map(transformEvent));
  const [pendingEvents, setPendingEvents] = useState<PendingEvent[]>(initialPendingEvents);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [isCalendarLoading, setIsCalendarLoading] = useState(false);

  // --- Calendar State ---
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"month" | "week" | "day">("month");
  const [showNewEventDialog, setShowNewEventDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [filterType, setFilterType] = useState<string>("all");

  // --- Derived State (Memos) ---
  const upcomingEvents = useMemo(() => {
    const now = new Date();
    return allEvents
      .map(event => ({ ...event, dateTime: new Date(`${event.date}T${event.time || '00:00'}`) }))
      .filter(event => event.dateTime >= now)
      .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime())
      .slice(0, 5)
      .map((event): UpcomingEvent => ({
        id: event.id,
        title: event.title,
        date: event.dateTime.toLocaleString(),
        type: event.type,
        attendees: event.attendees.length,
      }));
  }, [allEvents]);

  const filteredEvents = useMemo(() => {
    if (filterType === "all") return allEvents;
    return allEvents.filter((event) => event.type === filterType);
  }, [allEvents, filterType]);

  // --- Event Request Handlers ---
  const handleAcceptEvent = async (event: PendingEvent) => {
    setLoadingAction(`accept-${event.id}`);
    try {
      const acceptedEventData = await apiRequest(`/api/admin/events/requests/${event.id}/approve`, { method: "POST" });
      setAllEvents((prev) => [...prev, transformEvent(acceptedEventData)]);
      setPendingEvents((prev) => prev.filter((e) => e.id !== event.id));
      toast({ title: "Event Approved", description: `"${event.title}" is now on the calendar.` });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Could not approve event";
      toast({ title: "Error Approving Event", description: message, variant: "destructive" });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleRejectEvent = async (event: PendingEvent) => {
    setLoadingAction(`reject-${event.id}`);
    try {
      await apiRequest(`/api/admin/events/requests/${event.id}/reject`, { method: "POST" });
      setPendingEvents((prev) => prev.filter((e) => e.id !== event.id));
      toast({ title: "Event Rejected" });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Could not reject event";
      toast({ title: "Error Rejecting Event", description: message, variant: "destructive" });
    } finally {
      setLoadingAction(null);
    }
  };

  // --- Calendar Event CRUD ---
  const createOrUpdateEvent = async (data: EventFormData & { id?: string }): Promise<boolean> => {
    const isEdit = !!data.id;
    const url = isEdit ? `/api/admin/events/${data.id}` : "/api/admin/events";
    const method = isEdit ? "PUT" : "POST";
    setIsCalendarLoading(true);

    try {
      const savedEventData = await apiRequest(url, { method, body: JSON.stringify(data) });
      const savedEvent = transformEvent(savedEventData);
      setAllEvents(prev => isEdit ? prev.map(e => e.id === savedEvent.id ? savedEvent : e) : [...prev, savedEvent]);
      toast({ title: `Event ${isEdit ? "Updated" : "Created"}` });
      return true;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Could not save event";
      toast({ title: "Error Saving Event", description: message, variant: "destructive" });
      return false;
    } finally {
      setIsCalendarLoading(false);
    }
  };

  const handleDeleteEvent = async (event: Event) => {
    setIsCalendarLoading(true);
    setAllEvents(prev => prev.filter(e => e.id !== event.id)); // Optimistic update
    setSelectedEvent(null);
    try {
      await apiRequest(`/api/admin/events/${event.id}`, { method: "DELETE" });
      toast({ title: "Event Deleted" });
    } catch (error: unknown) {
      setAllEvents(prev => [...prev, event]); // Rollback
      const message = error instanceof Error ? error.message : "Could not delete event";
      toast({ title: "Error Deleting Event", description: message, variant: "destructive" });
    } finally {
      setIsCalendarLoading(false);
    }
  };

  // --- Calendar UI Actions ---
  const navigate = (direction: "prev" | "next") => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      const d = direction === "prev" ? -1 : 1;
      if (view === "month") newDate.setMonth(prev.getMonth() + d);
      if (view === "week") newDate.setDate(prev.getDate() + (d * 7));
      if (view === "day") newDate.setDate(prev.getDate() + d);
      return newDate;
    });
  };

  const handleDayClick = (date: Date) => {
    setCurrentDate(date);
    setView("day");
  };

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setShowNewEventDialog(true);
  };

  // --- Calendar Date Utils ---
  const formatDate = (date: Date) => {
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
  const formatDateString = (date: Date): string => date.toISOString().split('T')[0];

  return {
    allEvents, setAllEvents,
    pendingEvents, setPendingEvents,
    loadingAction,
    eventRequestData: { pendingEvents, handleAcceptEvent, handleRejectEvent },
    calendarData: {
      view,
      currentDate,
      events: filteredEvents,
      upcomingEvents,
      showNewEventDialog,
      selectedEvent,
      isLoading: isCalendarLoading,
      filterType,
      actions: {
        setView,
        navigate,
        createEvent: createOrUpdateEvent,
        setSelectedEvent,
        setShowNewEventDialog,
        setFilterType,
        handleDayClick,
        handleEditEvent,
        handleDeleteEvent,
      },
      utils: {
        formatDate: () => formatDate(currentDate),
        getDaysInMonth,
        getFirstDayOfMonth,
        formatDateString,
      },
    },
    transformEvent,
  };
};