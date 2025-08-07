/**
 * hook.ts
 *
 * This file contains the custom hook `useDepartmentView` which encapsulates
 * the client-side state and logic for the department view page. This includes
 * managing the calendar state, dialog visibility, and mock ticket data.
 */
import { useState, useMemo } from "react";
import { Ticket } from "./types";

interface UseDepartmentViewArgs {
  departmentName: string;
}

export const useDepartmentView = ({ departmentName }: UseDepartmentViewArgs) => {
  // State for the selected date in the calendar
  const [date, setDate] = useState<Date | undefined>(new Date());
  // State to control the visibility of the "New Initiative" dialog
  const [showNewTicket, setShowNewTicket] = useState(false);

  // Mock data for tickets. In a real-world app, this would likely be fetched from an API.
  const tickets: Ticket[] = useMemo(() => [
    { id: "t1", title: "Q1 Architecture Review", type: "meeting", status: "in_progress", assignee: null, duration: "2 months", messages: 12, lastActivity: "1 hour ago", collaborative: true, calendarDate: new Date("2025-01-25"), collaborators: ["Sami", "Yasmine"] },
    { id: "t2", title: "Tech Stack Migration Plan", type: "task", status: "pending", assignee: "Yasmine", duration: "6 months", messages: 8, lastActivity: "2 days ago", collaborative: false, calendarDate: new Date("2025-01-30"), collaborators: [] },
    { id: "t3", title: "Annual Development Conference", type: "event", status: "scheduled", assignee: null, duration: "1 year", messages: 25, lastActivity: "5 hours ago", collaborative: true, calendarDate: new Date("2025-01-28"), collaborators: ["Sami", "Yasmine"] },
    { id: "t4", title: "Security Audit Planning", type: "meeting", status: "scheduled", assignee: "Sami", duration: "3 months", messages: 3, lastActivity: "1 day ago", collaborative: true, calendarDate: new Date("2025-01-26"), collaborators: ["Sami"] },
  ], []);

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
    tickets,
    selectedDateTickets,
    calendarEvents,
    goToPreviousDay,
    goToNextDay,
  };
};
