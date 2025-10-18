// src/app/(protected)/teams/[teamId]/hook.ts
"use client";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type { TeamTicket as Ticket, Event } from "./types";
import { useMemo } from "react";
import type {  EventFormData, UpcomingEvent } from "./types";
import { formatDate, getDaysInMonth, getFirstDayOfMonth, formatDateString } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface UseTeamViewArgs {
  tickets: Ticket[];
  initialEvents: Event[];
  teamId: string;
}

export function useTeamView({ tickets, initialEvents, teamId }: UseTeamViewArgs) {
  const { toast } = useToast();
  const router = useRouter();
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [showEditTeam, setShowEditTeam] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const calendar = useCalendar({
    initialEvents,
    toast,
  });

  const handleUpdateTeam = async (data: any) => {
    try {
      const response = await fetch(`/api/teams/${teamId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to update team');

      toast({ title: "Success", description: "Team updated successfully." });
      setShowEditTeam(false);
      router.refresh();
    } catch (error) {
      toast({ title: "Error", description: "Could not update team.", variant: "destructive" });
    }
  };

  const handleDeleteTeam = async () => {
    try {
      const response = await fetch(`/api/teams/${teamId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete team');

      toast({ title: "Success", description: "Team deleted successfully." });
      router.push('/teams');
    } catch (error) {
      toast({ title: "Error", description: "Could not delete team.", variant: "destructive" });
    }
  };

  return {
    showNewTicket,
    setShowNewTicket,
    showEditTeam,
    setShowEditTeam,
    showDeleteAlert,
    setShowDeleteAlert,
    handleUpdateTeam,
    handleDeleteTeam,
    ...calendar,
  };
}




interface UseCalendarArgs {
  initialEvents: Event[];
  toast: (options: { title: string; description?: string; variant?: "default" | "destructive" }) => void;
}

export function useCalendar({ initialEvents, toast }: UseCalendarArgs) {
  const [allEvents, setAllEvents] = useState<Event[]>(() =>
    initialEvents.map((event: Event) => ({
      ...event,
      date: new Date(event.date).toISOString().split('T')[0],
    }))
  );
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState<"month" | "week" | "day">("month");
  const [filterType, setFilterType] = useState<string>("all");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showNewEventDialog, setShowNewEventDialog] = useState(false);
  const [isCalendarLoading, setIsCalendarLoading] = useState(false);

  const simulateApi = (duration = 700) => new Promise((res) => setTimeout(res, duration));

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

  const createOrUpdateEvent = async (formData: EventFormData & { id?: number | string }): Promise<boolean> => {
    setIsCalendarLoading(true);
    const isEditMode = formData.id !== undefined;

    try {
      await simulateApi();

      if (isEditMode) {
        const updatedEvent: Event = {
          id: Number(formData.id!),
          title: formData.title,
          description: formData.description || "",
          date: formData.date,
          time: formData.time,
          duration: parseInt(formData.duration),
          type: formData.type,
          attendees: ["You", "Engineering Team"],
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

  const events = useMemo(() => {
    if (filterType === "all") return allEvents;
    return allEvents.filter((event) => event.type === filterType);
  }, [allEvents, filterType]);

  return {
    currentDate,
    calendarView,
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
    formatDate: (d: Date) => formatDate(d, calendarView),
    getDaysInMonth,
    getFirstDayOfMonth,
    formatDateString,
  };
}
