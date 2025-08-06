// hook.ts

import { useState, useMemo, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useParams } from "next/navigation";
import { Department, Leader, Team, Ticket } from "./types"; // Import shared types

interface DepartmentViewProps {
  departmentId: string;
  departmentName: string;
  derpartmentDescription: string;
}

export const useDepartmentView = ({ departmentId, departmentName, derpartmentDescription }: DepartmentViewProps) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [showNewTicket, setShowNewTicket] = useState(false);
  const { toast } = useToast();

  const department = useMemo(() => ({
    id: departmentId,
    name: departmentName,
    description: derpartmentDescription,
    leaders: [
      { id: "u1", name: "Sami", role: "super_leader", avatar: "/placeholder.svg?height=32&width=32", status: "online", email: "sami@itc.com", joinedDate: "2024-01-01" },
      { id: "u2", name: "Yasmine", role: "leader", avatar: "/placeholder.svg?height=32&width=32", status: "online", email: "yasmine@itc.com", joinedDate: "2024-01-15" },
    ] as Leader[],
    teams: [
      { id: "team-1", name: "Frontend Team", memberCount: 5, leader: "Ali", status: "active" },
      { id: "team-2", name: "Backend Team", memberCount: 4, leader: "Omar", status: "active" },
      { id: "team-3", name: "Mobile Team", memberCount: 3, leader: "Layla", status: "planning" },
    ] as Team[],
  }), [departmentId, departmentName, derpartmentDescription]);

  const tickets: Ticket[] = useMemo(() => [
    { id: "t1", title: "Q1 Architecture Review", type: "meeting", status: "in_progress", assignee: null, duration: "2 months", messages: 12, lastActivity: "1 hour ago", collaborative: true, calendarDate: new Date("2025-01-25"), collaborators: ["Sami", "Yasmine"] },
    { id: "t2", title: "Tech Stack Migration Plan", type: "task", status: "pending", assignee: "Yasmine", duration: "6 months", messages: 8, lastActivity: "2 days ago", collaborative: false, calendarDate: new Date("2025-01-30"), collaborators: [] },
    { id: "t3", title: "Annual Development Conference", type: "event", status: "scheduled", assignee: null, duration: "1 year", messages: 25, lastActivity: "5 hours ago", collaborative: true, calendarDate: new Date("2025-01-28"), collaborators: ["Sami", "Yasmine"] },
    { id: "t4", title: "Security Audit Planning", type: "meeting", status: "scheduled", assignee: "Sami", duration: "3 months", messages: 3, lastActivity: "1 day ago", collaborative: true, calendarDate: new Date("2025-01-26"), collaborators: ["Sami"] },
  ], []);

  const selectedDateTickets = useMemo(() => {
    return tickets.filter(ticket => date && ticket.calendarDate.toDateString() === date.toDateString());
  }, [tickets, date]);

  const calendarEvents = useMemo(() => {
    return tickets.reduce((acc, ticket) => {
      const dateKey = ticket.calendarDate.toDateString();
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(ticket);
      return acc;
    }, {} as Record<string, typeof tickets>);
  }, [tickets]);

  const handleTeamAction = (action: string, teamId: string) => {
    const team = department.teams.find((t) => t.id === teamId);
    toast({
      title: `${action} ${team?.name}`,
      description: `Action "${action}" performed on ${team?.name}`,
    });
  };

  const handleLeaderAction = (action: string, leaderId: string) => {
    const leader = department.leaders.find((l) => l.id === leaderId);
    toast({
      title: `${action} ${leader?.name}`,
      description: `Action "${action}" performed on ${leader?.name}`,
    });
  };

  const goToPreviousDay = () => {
    if (date) {
      const newDate = new Date(date);
      newDate.setDate(newDate.getDate() - 1);
      setDate(newDate);
    }
  };

  const goToNextDay = () => {
    if (date) {
      const newDate = new Date(date);
      newDate.setDate(newDate.getDate() + 1);
      setDate(newDate);
    }
  };

  return {
    date,
    setDate,
    showNewTicket,
    setShowNewTicket,
    department,
    tickets,
    selectedDateTickets,
    calendarEvents,
    handleTeamAction,
    handleLeaderAction,
    goToPreviousDay,
    goToNextDay,
  };
};

/**
 * Custom hook to fetch and manage department detail data.
 * @returns An object containing the department data and the loading state.
 */
export function useDepartmentDetail() {
  const params = useParams();
  const departmentId = params.departmentId as string;

  const [department, setDepartment] = useState<Department | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!departmentId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setDepartment(null);

    const fetchDepartment = setTimeout(() => {
      const mockDepartment: Department = {
        id: departmentId,
        name: departmentId === "dept-1" ? "Engineering" : departmentId === "dept-2" ? "Design" : "Product",
        description:
          departmentId === "dept-1"
            ? "Software development and technical infrastructure"
            : departmentId === "dept-2"
              ? "User experience and visual design"
              : "Product strategy and management",
        head: {
          name: departmentId === "dept-1" ? "Sami Al-Rashid" : departmentId === "dept-2" ? "Yasmine Hassan" : "Fatima Al-Zahra",
          avatar: "/placeholder.svg?height=32&width=32",
          id: departmentId === "dept-1" ? "sami" : departmentId === "dept-2" ? "yasmine" : "fatima",
        },
        teamCount: departmentId === "dept-1" ? 3 : 1,
        memberCount: departmentId === "dept-1" ? 18 : departmentId === "dept-2" ? 5 : 4,
        budget: departmentId === "dept-1" ? "$2,400,000" : departmentId === "dept-2" ? "$800,000" : "$600,000",
        status: "active",
        createdAt: "2023-01-15",
      };
      setDepartment(mockDepartment);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(fetchDepartment);
  }, [departmentId]);

  return { department, loading };
}