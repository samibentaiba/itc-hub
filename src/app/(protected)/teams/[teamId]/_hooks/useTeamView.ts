"use client";
import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import type { TeamTicket as Ticket, Event, EventFormData } from "../types";
import { useCalendar } from "./useCalendar";

import { useRouter } from "next/navigation";

interface UseTeamViewArgs {
  tickets: Ticket[];
  initialEvents: Event[];
  teamId: string;
}

export function useTeamView({ tickets, initialEvents, teamId }: UseTeamViewArgs) {
  const { toast } = useToast();
  const router = useRouter();
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
    showEditTeam,
    setShowEditTeam,
    showDeleteAlert,
    setShowDeleteAlert,
    handleUpdateTeam,
    handleDeleteTeam,
    ...calendar,
  };
}
