import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, transformApiResponse } from "../utils";
import type { Team, TeamFormData } from "../types";

/**
 * @hook useTeams
 * @description Manages state and actions related to teams.
 * @param {Team[]} initialTeams - The initial list of teams.
 * @returns {object} - The teams state and action handlers.
 */
export const useTeams = (initialTeams: Team[]) => {
  const { toast } = useToast();
  const [teams, setTeams] = useState<Team[]>(initialTeams);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const handleSaveTeam = async (data: TeamFormData & { id?: string }) => {
    const isEdit = !!data.id;
    const url = isEdit ? `/api/admin/teams/${data.id}` : "/api/admin/teams";
    const method = isEdit ? "PUT" : "POST";
    setLoadingAction(isEdit ? `edit-${data.id}` : "add-team");

    try {
      const savedTeamData = await apiRequest(url, { method, body: JSON.stringify(data) });
      const savedTeam = transformApiResponse(savedTeamData, 'team');

      if (isEdit) {
        setTeams((prev) => prev.map((t) => (t.id === savedTeam.id ? { ...t, ...savedTeam } : t)));
      } else {
        setTeams((prev) => [savedTeam, ...prev]);
      }
      toast({ title: isEdit ? "Team Updated" : "Team Created" });
      return true;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error Saving Team";
      toast({ title: "Error Saving Team", description: message, variant: "destructive" });
      return false;
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDeleteTeam = async (teamId: string) => {
    setLoadingAction(`delete-${teamId}`);
    const originalTeams = teams;
    setTeams((prev) => prev.filter((t) => t.id !== teamId));
    try {
      await apiRequest(`/api/admin/teams/${teamId}`, { method: "DELETE" });
      toast({ title: "Team Deleted" });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error Deleting Team";
      toast({ title: "Error Deleting Team", description: message, variant: "destructive" });
      setTeams(originalTeams);
    } finally {
      setLoadingAction(null);
    }
  };

  return {
    teams,
    setTeams,
    loadingAction,
    handleSaveTeam,
    handleDeleteTeam,
  };
};