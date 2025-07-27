import { useState, useEffect } from "react";
import { getTickets } from "@/services/ticketService";

interface Assignee {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface Team {
  id: string;
  name: string;
}

interface Department {
  id: string;
  name: string;
}

interface Ticket {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  assignee?: Assignee;
  team?: Team;
  department?: Department;
  dueDate?: string;
}

export function useTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTickets() {
      setLoading(true);
      try {
        const data = await getTickets();
        setTickets(data);
      } catch (error) {
        console.error("Failed to fetch tickets:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTickets();
  }, []);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "VERIFIED":
        return "default";
      case "IN_PROGRESS":
        return "secondary";
      case "SCHEDULED":
        return "outline";
      default:
        return "outline";
    }
  };

  const getStatusDisplayName = (status: string) => {
    switch (status) {
      case "VERIFIED":
        return "Verified";
      case "IN_PROGRESS":
        return "In Progress";
      case "SCHEDULED":
        return "Scheduled";
      default:
        return status;
    }
  };

  const formatDueDate = (dueDate?: string) => {
    if (!dueDate) return "N/A";
    return new Date(dueDate).toLocaleDateString();
  };

  const getTeamOrDepartmentName = (ticket: Ticket) => {
    return ticket.team?.name || ticket.department?.name || "N/A";
  };

  return {
    tickets,
    loading,
    getStatusBadgeVariant,
    getStatusDisplayName,
    formatDueDate,
    getTeamOrDepartmentName,
  };
}
