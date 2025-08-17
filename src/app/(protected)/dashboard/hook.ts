// /dashboard/hook.ts

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import type { DashboardTicketLocal, WorkspaceStats } from "../types";

/**
 * A custom hook to manage the state and logic for the dashboard's client-side interactions.
 * It accepts initial data fetched from the server to avoid re-fetching on the client.
 * @param initialTickets - The initial list of tickets from the server.
 * @param initialStats - The initial workspace stats from the server.
 */
export const useDashboardPage = (
  initialTickets: DashboardTicketLocal[],
  initialStats: WorkspaceStats
) => {
  const [selectedStatCard, setSelectedStatCard] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleStatCardClick = async (cardType: string) => {
    setSelectedStatCard(cardType);
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const path = {
        "Teams": "/teams",
        "Departments": "/departments",
        "Active Tickets": "/tickets?status=active",
        "Completed": "/tickets?status=completed",
      }[cardType];
      if (path) router.push(path);
      toast({
        title: `${cardType} Details`,
        description: `Navigating to ${cardType.toLowerCase()} overview.`,
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to load details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setSelectedStatCard(null);
    }
  };

  const handleQuickAction = async (action: string) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (action === "View All Tickets") {
        router.push("/tickets");
      }
      // Other quick actions can be handled here...
    } catch {
      toast({
        title: "Action Failed",
        description: "Failed to perform action. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  return {
    selectedStatCard,
    isLoading,
    myTickets: initialTickets,
    workspaceStats: initialStats,
    handleStatCardClick,
    handleQuickAction,
    getPriorityColor,
  };
};
