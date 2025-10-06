
"use client";
import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import type { Ticket, Event, EventFormData } from "../types";
import { useCalendar } from "./useCalendar";

interface UseDepartmentViewArgs {
  tickets: Ticket[];
  initialEvents: Event[];
}

export function useDepartmentView({ tickets, initialEvents }: UseDepartmentViewArgs) {
  const { toast } = useToast();
  const [showNewTicket, setShowNewTicket] = useState(false);

  const calendar = useCalendar({
    initialEvents,
    toast,
  });

  // Memoized Derived State
  const selectedDateTickets = useMemo(() => {
    if (!calendar.currentDate) return [];

    return tickets.filter(ticket => {
      const ticketDate = ticket.dueDate ? new Date(ticket.dueDate) : new Date(ticket.createdAt);
      return ticketDate.toDateString() === calendar.currentDate.toDateString();
    });
  }, [tickets, calendar.currentDate]);

  const calendarEvents = useMemo(() => {
    return tickets.reduce((acc, ticket) => {
      const ticketDate = ticket.dueDate ? new Date(ticket.dueDate) : new Date(ticket.createdAt);
      const dateKey = ticketDate.toDateString();

      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(ticket);
      return acc;
    }, {} as Record<string, Ticket[]>);
  }, [tickets]);

  return {
    showNewTicket,
    setShowNewTicket,
    selectedDateTickets,
    calendarEvents,
    ...calendar,
  };
}
