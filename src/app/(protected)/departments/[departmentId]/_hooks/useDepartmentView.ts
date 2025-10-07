
"use client";
import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import type { Ticket, Event, EventFormData } from "../types";
import { useCalendar } from "./useCalendar";

import { useRouter } from "next/navigation";

interface UseDepartmentViewArgs {
  tickets: Ticket[];
  initialEvents: Event[];
  departmentId: string;
}

export function useDepartmentView({ tickets, initialEvents, departmentId }: UseDepartmentViewArgs) {
  const { toast } = useToast();
  const router = useRouter();
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [showEditDepartment, setShowEditDepartment] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const calendar = useCalendar({
    initialEvents,
    toast,
  });

  const handleUpdateDepartment = async (data: any) => {
    try {
      const response = await fetch(`/api/departments/${departmentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to update department');

      toast({ title: "Success", description: "Department updated successfully." });
      setShowEditDepartment(false);
      router.refresh();
    } catch (error) {
      toast({ title: "Error", description: "Could not update department.", variant: "destructive" });
    }
  };

  const handleDeleteDepartment = async () => {
    try {
      const response = await fetch(`/api/departments/${departmentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete department');

      toast({ title: "Success", description: "Department deleted successfully." });
      router.push('/departments');
    } catch (error) {
      toast({ title: "Error", description: "Could not delete department.", variant: "destructive" });
    }
  };

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
    showEditDepartment,
    setShowEditDepartment,
    showDeleteAlert,
    setShowDeleteAlert,
    handleUpdateDepartment,
    handleDeleteDepartment,
    selectedDateTickets,
    calendarEvents,
    ...calendar,
  };
}
