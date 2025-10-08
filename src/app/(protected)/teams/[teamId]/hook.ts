// src/app/(protected)/teams/[teamId]/hook.ts
"use client";

import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import type { TeamDetail, TeamTicket, TeamMember, Event, UpcomingEvent, EventFormData, TeamLocal, StatLocal } from "./types";
import { formatDate, getDaysInMonth, getFirstDayOfMonth, formatDateString } from "./utils";

// Hook for teams list page
export function useTeamsPage(
  initialTeams: TeamLocal[],
  initialStats: StatLocal[]
) {
  const stats = useMemo(() => initialStats, [initialStats]);
  const teams = useMemo(() => initialTeams, [initialTeams]);

  const getDepartmentColor = (department: string): string => {
    const colors: Record<string, string> = {
      Engineering: "bg-blue-500",
      Design: "bg-purple-500",
      Marketing: "bg-green-500",
      Sales: "bg-yellow-500",
      HR: "bg-pink-500",
      Finance: "bg-indigo-500",
      Operations: "bg-orange-500",
      Support: "bg-teal-500",
    };

    return colors[department] || "bg-gray-500";
  };

  return {
    stats,
    teams,
    getDepartmentColor,
  };
}

// Hook for team detail page
export function useTeamDetailPage(
  initialTeam: TeamDetail,
  initialTickets: TeamTicket[]
) {
  const { toast } = useToast();

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [showNewTicket, setShowNewTicket] = useState(false);

  // New calendar state
  const [allEvents, setAllEvents] = useState<Event[]>(initialTeam.events || []);
  const [upcomingEvents] = useState<UpcomingEvent[]>(initialTeam.upcomingEvents || []);
  const [currentDate, setCurrentDate] = useState(new Date("2025-08-01"));
  const [calendarView, setCalendarView] = useState<"month" | "week" | "day">("month");
  const [filterType, setFilterType] = useState<string>("all");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showNewEventDialog, setShowNewEventDialog] = useState(false);
  const [isCalendarLoading, setIsCalendarLoading] = useState(false);

  const { selectedDateTickets, calendarEvents } = useMemo(() => {
    const events = initialTickets.reduce((acc, ticket) => {
      const dateKey = new Date(ticket.dueDate).toDateString();
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(ticket);
      return acc;
    }, {} as Record<string, TeamTicket[]>);

    const selectedTickets = date ? events[date.toDateString()] || [] : [];
    
    return { selectedDateTickets: selectedTickets, calendarEvents: events };
  }, [date, initialTickets]);

  const handleMemberAction = (action: string, member: TeamMember) => {
    toast({
      title: `${action} ${member.name}`,
      description: `Action "${action}" performed on ${member.name}`,
    });
  };

  const handleInviteMember = () => {
    toast({
      title: "Invitation sent",
      description: "Team invitation has been sent successfully.",
    });
  };

  const simulateApi = (duration = 700) => new Promise((res) => setTimeout(res, duration));

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
          attendees: ["You", "Team"], 
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
    team: initialTeam,
    tickets: initialTickets,
    date,
    setDate,
    showNewTicket,
    setShowNewTicket,
    selectedDateTickets,
    calendarEvents,
    handleMemberAction,
    handleInviteMember,
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
    formatDate: (d: Date) => formatDate(d, calendarView),
    getDaysInMonth,
    getFirstDayOfMonth,
    formatDateString,
  };
}