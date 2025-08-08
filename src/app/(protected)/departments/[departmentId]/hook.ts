/**
 * hook.ts
 *
 * This file contains the custom hook `useDepartmentView` which encapsulates
 * the client-side state and logic for the department view page. This includes
 * managing the calendar state, dialog visibility, and processing ticket data.
 */
import { useState, useMemo } from "react";
import { Ticket } from "./types";

interface UseDepartmentViewArgs {
  tickets: Ticket[];
}

export const useDepartmentView = ({ tickets }: UseDepartmentViewArgs) => {
  // State for the selected date in the calendar
  const [date, setDate] = useState<Date | undefined>(new Date());
  // State to control the visibility of the "New Initiative" dialog
  const [showNewTicket, setShowNewTicket] = useState(false);

  // Memoized calculation to filter tickets for the selected date
  const selectedDateTickets = useMemo(() => {
    if (!date) return [];
    return tickets.filter(ticket => ticket.calendarDate.toDateString() === date.toDateString());
  }, [tickets, date]);

  // Memoized calculation to create a map of events for the calendar display
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

  // Handler to navigate to the previous day in the calendar
  const goToPreviousDay = () => {
    if (date) {
      const newDate = new Date(date);
      newDate.setDate(newDate.getDate() - 1);
      setDate(newDate);
    }
  };

  // Handler to navigate to the next day in the calendar
  const goToNextDay = () => {
    if (date) {
      const newDate = new Date(date);
      newDate.setDate(newDate.getDate() + 1);
      setDate(newDate);
    }
  };

  // Return all state and handlers to be used by the component
  return {
    date,
    setDate,
    showNewTicket,
    setShowNewTicket,
    selectedDateTickets,
    calendarEvents,
    goToPreviousDay,
    goToNextDay,
  };
};