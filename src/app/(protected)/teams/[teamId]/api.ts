// src/app/(protected)/teams/[teamId]/api.ts
import { type TeamDetail, type TeamTicket } from "./types";
import data from "./mock.json";

interface MockData {
  teams: Record<string, TeamDetail>;
  tickets: Record<string, TeamTicket[]>;
}
const mockData = data as MockData;

export const fetchTeamById = async (teamId: string): Promise<TeamDetail | null> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const team = mockData.teams[teamId] || null;
  if (team) {
    // Simulate fetching events for the team
    team.events = [
      { id: 1, title: "Team Standup", description: "Daily standup meeting", date: "2025-08-25", time: "10:00", duration: 15, type: "meeting", attendees: ["Sami", "Ali"], location: "Virtual", color: "bg-blue-500" },
      { id: 2, title: "Sprint Planning", description: "Planning for the next sprint", date: "2025-08-27", time: "14:00", duration: 60, type: "planning", attendees: ["Sami", "Ali", "Sara"], location: "Conference Room B", color: "bg-purple-500" }
    ];
    team.upcomingEvents = [
        { id: 1, title: "Team Standup", date: "Today, 10:00 AM", type: "meeting", attendees: 2 },
    ];
  }
  return team;
};

export const fetchTicketsByTeamId = async (teamId: string): Promise<TeamTicket[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const tickets = mockData.tickets[teamId] || [];
  return tickets;
};
