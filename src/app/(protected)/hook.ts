"use client";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { getTickets } from "@/services/ticketService";
import { getTeams } from "@/services/teamService";
import { getDepartments } from "@/services/departmentService";

export function useHome() {
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [selectedStatCard, setSelectedStatCard] = useState<string | null>(null);
  const [tickets, setTickets] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [tickets, teams, departments] = await Promise.all([
        getTickets(),
        getTeams(),
        getDepartments(),
      ]);
      setTickets(tickets);
      setTeams(teams);
      setDepartments(departments);
      setLoading(false);
    }
    fetchData();
  }, []);

  // Example: filter tickets assigned to a specific user (replace with real user id)
  const myUserId = tickets[0]?.assigneeId || "";
  const myTickets = tickets.filter((t) => t.assigneeId === myUserId);

  const workspaceStats = {
    teams: {
      count: teams.length,
      change: "+" + teams.length + " this month",
      trend: "up",
    },
    departments: {
      count: departments.length,
      change: "No change",
      trend: "stable",
    },
    activeTickets: {
      count: tickets.filter(
        (t) => t.status !== "VERIFIED" && t.status !== "CLOSED"
      ).length,
      change: "+" + tickets.length + " this week",
      trend: "up",
    },
    completedThisWeek: {
      count: tickets.filter((t) => t.status === "VERIFIED").length,
      change:
        "+" +
        tickets.filter((t) => t.status === "VERIFIED").length +
        " from last week",
      trend: "up",
    },
  };

  const handleStatCardClick = (cardType: string) => {
    setSelectedStatCard(cardType);
    toast({
      title: `${cardType} Details`,
      description: `Viewing detailed information for ${cardType.toLowerCase()}.`,
    });
  };

  const handleQuickAction = (action: string) => {
    toast({
      title: `Quick Action: ${action}`,
      description: `Performing ${action.toLowerCase()}...`,
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-500";
      case "medium":
        return "text-yellow-500";
      case "low":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  return {
    loading,
    handleStatCardClick,
    workspaceStats,
    handleQuickAction,
    getPriorityColor,
    myTickets,
  };
}
