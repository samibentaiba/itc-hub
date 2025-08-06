"use client";

import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import type { TeamDetail, TeamTicket, TeamMember } from "./types";

// The hook now accepts initial data, removing the need for internal fetching.
export function useTeamDetailPage(
  initialTeam: TeamDetail,
  initialTickets: TeamTicket[]
) {
  const { toast } = useToast();

  // State for client-side interactions
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [showNewTicket, setShowNewTicket] = useState(false);

  // Memoize calendar-related calculations to run only when data changes.
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

  // Handler functions remain on the client for interactivity.
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
  };
}
