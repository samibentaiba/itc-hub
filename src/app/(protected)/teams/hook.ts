import { useState, useEffect } from "react";
import { getTeams } from "@/services/teamService";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
}

interface Team {
  id: string;
  name: string;
  description?: string;
  members: TeamMember[];
  tickets?: any[];
}

export function useTeams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTeams() {
      setLoading(true);
      try {
        const data = await getTeams();
        setTeams(data);
      } catch (error) {
        console.error("Failed to fetch teams:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTeams();
  }, []);

  const getTeamMembersByRole = (team: Team) => {
    const superLeader =
      team.members.find((m) => m.role === "SUPERLEADER") || null;
    const leaders = team.members.filter((m) => m.role === "LEADER");
    const members = team.members.filter((m) => m.role === "MEMBER");
    const memberCount = (superLeader ? 1 : 0) + leaders.length + members.length;
    const ticketCount = team.tickets?.length || 0;

    return {
      superLeader,
      leaders,
      members,
      memberCount,
      ticketCount,
    };
  };

  return {
    teams,
    loading,
    getTeamMembersByRole,
  };
}
