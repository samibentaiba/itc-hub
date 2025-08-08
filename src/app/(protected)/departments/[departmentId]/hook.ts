// src/app/(protected)/departments/[departmentId]/hook.ts

/**
 * hook.ts
 *
 * This file contains the custom hook `useDepartmentView` which encapsulates
 * all client-side state and logic for the department view page. It manages
 * both the legacy ticket-based calendar and the new advanced event calendar.
 */
"use client";

import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import type { Ticket, Event, UpcomingEvent, EventFormData, Member } from "./types";
import { formatDate, getDaysInMonth, getFirstDayOfMonth, formatDateString } from "./utils";

// Defines the props that the hook will receive
interface UseDepartmentViewArgs {
  tickets: Ticket[];
  initialEvents: Event[];
  initialUpcomingEvents: UpcomingEvent[];
}

export const useDepartmentView = ({ tickets, initialEvents, initialUpcomingEvents }: UseDepartmentViewArgs) => {
  const { toast } = useToast();

  // --- State Management ---

  // State for the old, simple calendar feature (based on tickets)
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  // State for the new, advanced calendar feature (based on events)
  const [allEvents, setAllEvents] = useState<Event[]>(initialEvents);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>(initialUpcomingEvents);
  const [currentDate, setCurrentDate] = useState(new Date("2025-08-01"));
  const [calendarView, setCalendarView] = useState<"month" | "week" | "day">("month");
  const [filterType, setFilterType] = useState<string>("all");
  
  // State for handling dialogs and selected data
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showNewEventDialog, setShowNewEventDialog] = useState(false);
  
  // Loading state for asynchronous actions
  const [isCalendarLoading, setIsCalendarLoading] = useState(false);
  
  // Legacy state for the simple "New Initiative" button
  const [showNewTicket, setShowNewTicket] = useState(false);


  // --- API Simulation ---
  const simulateApi = (duration = 700) => new Promise((res) => setTimeout(res, duration));


  // --- Event CRUD Handlers (for New Calendar) ---

  /**
   * Handles both creating a new event and updating an existing one.
   */
  const createOrUpdateEvent = async (formData: EventFormData & { id?: number }): Promise<boolean> => {
    setIsCalendarLoading(true);
    const isEditMode = formData.id !== undefined;

    try {
      await simulateApi();

      if (isEditMode) {
        const updatedEvent: Event = {
          id: formData.id!,
          title: formData.title,
          description: formData.description || "",
          date: formData.date,
          time: formData.time,
          duration: parseInt(formData.duration),
          type: formData.type,
          attendees: ["You", "Engineering Team"], // Placeholder
          location: formData.location || "Virtual",
          color: "bg-blue-500",
        };
        setAllEvents(prev => prev.map(e => e.id === formData.id ? updatedEvent : e));
        toast({ title: "Event Updated", description: `"${formData.title}" has been updated.` });
      } else {
        const newEvent: Event = {
          id: Date.now(),
          title: formData.title,
          description: formData.description || "",
          date: formData.date,
          time: formData.time,
          duration: parseInt(formData.duration),
          type: formData.type,
          attendees: ["You"],
          location: formData.location || "Virtual",
          color: "bg-green-500",
        };
        setAllEvents(prev => [...prev, newEvent].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
        toast({ title: "Event Created", description: `"${formData.title}" has been added.` });
      }
      
      setSelectedEvent(null);
      return true;
    } catch {
      toast({ title: isEditMode ? "Error Updating" : "Error Creating", variant: "destructive" });
      return false;
    } finally {
      setIsCalendarLoading(false);
    }
  };

  /**
   * Handles the deletion of an event.
   */
  const handleDeleteEvent = async (event: Event) => {
    setIsCalendarLoading(true);
    try {
      await simulateApi();
      setAllEvents(prev => prev.filter(e => e.id !== event.id));
      toast({ title: "Event Deleted", description: `"${event.title}" has been removed.` });
      setSelectedEvent(null);
    } catch {
      toast({ title: "Error Deleting Event", variant: "destructive" });
    } finally {
      setIsCalendarLoading(false);
    }
  };


  // --- UI Interaction Handlers (for New Calendar) ---

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setShowNewEventDialog(true);
  };
  
  const onNewEventClick = () => {
    setSelectedEvent(null);
    setShowNewEventDialog(true);
  };

  const onNavigateCalendar = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      const increment = direction === 'prev' ? -1 : 1;
      if (calendarView === "month") newDate.setMonth(prev.getMonth() + increment);
      if (calendarView === "week") newDate.setDate(prev.getDate() + (increment * 7));
      if (calendarView === "day") newDate.setDate(prev.getDate() + increment);
      return newDate;
    });
  };

  const onDayClick = (date: Date) => {
    setCurrentDate(date);
    setCalendarView("day");
  };


  // --- Handlers for Old Calendar ---

  const goToPreviousDay = () => {
    if (date) {
      const newDate = new Date(date);
      newDate.setDate(newDate.getDate() - 1);
      setDate(newDate);
    }
  };

  const goToNextDay = () => {
    if (date) {
      const newDate = new Date(date);
      newDate.setDate(newDate.getDate() + 1);
      setDate(newDate);
    }
  };


  // --- Memoized Derived State ---

  // For new calendar: Filters events based on the selected type
  const events = useMemo(() => {
    if (filterType === "all") return allEvents;
    return allEvents.filter((event) => event.type === filterType);
  }, [allEvents, filterType]);

  // For old calendar: Filters tickets for the selected date
  const selectedDateTickets = useMemo(() => {
    if (!date) return [];
    return tickets.filter(ticket => ticket.calendarDate.toDateString() === date.toDateString());
  }, [tickets, date]);

  // For old calendar: Creates a map of tickets by date
  const calendarEvents = useMemo(() => {
    return tickets.reduce((acc, ticket) => {
      const dateKey = ticket.calendarDate.toDateString();
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(ticket);
      return acc;
    }, {} as Record<string, Ticket[]>);
  }, [tickets]);


  // --- Return Value ---
  return {
    // Old Calendar State & Handlers
    date,
    setDate,
    selectedDateTickets,
    calendarEvents,
    goToPreviousDay,
    goToNextDay,
    
    // New Calendar State & Handlers
    calendarView,
    currentDate,
    events,
    upcomingEvents,
    filterType,
    selectedEvent,
    isCalendarLoading,
    showNewEventDialog,
    setShowNewEventDialog,
    onSetCalendarView: setCalendarView,
    onNavigateCalendar,
    onSetSelectedEvent: setSelectedEvent,
    onNewEventClick,
    onFilterChange: setFilterType,
    onDayClick,
    createEvent: createOrUpdateEvent,
    handleEditEvent,
    handleDeleteEvent,
    setSelectedEvent,
    // Legacy State
    showNewTicket,
    setShowNewTicket,

    // Utils
    formatDate: (d: Date) => formatDate(d, calendarView),
    getDaysInMonth,
    getFirstDayOfMonth,
    formatDateString,
  };
};