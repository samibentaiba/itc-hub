"use client";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { getDepartments } from "@/services/departmentService";
import { getTickets } from "@/services/ticketService";
export function useDepartment({
  params,
}: {
  params: {
    departmentId: string;
  };
}) {
  const departmentId = params.departmentId;
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [department, setDepartment] = useState<any>(null);
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const departments = await getDepartments();
      const foundDept = departments.find((d: any) => d.id === departmentId);
      setDepartment(foundDept);
      const allTickets = await getTickets();
      const filtered = allTickets.filter(
        (t: any) => t.departmentId === departmentId
      );
      setTickets(filtered);
      setLoading(false);
    }
    fetchData();
  }, [departmentId]);

  const selectedDateTickets = tickets.filter(
    (ticket) =>
      date && new Date(ticket.dueDate).toDateString() === date.toDateString()
  );

  const calendarEvents = tickets.reduce((acc, ticket) => {
    const dateKey = new Date(ticket.dueDate).toDateString();
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(ticket);
    return acc;
  }, {} as Record<string, typeof tickets>);

  const handleTeamAction = (action: string, teamId: string) => {
    const team = department.teams.find((t: any) => t.id === teamId);
    toast({
      title: `${action} ${team?.name}`,
      description: `Action "${action}" performed on ${team?.name}`,
    });
  };

  const handleLeaderAction = (action: string, leaderId: string) => {
    const leader = department.leaders.find((l: any) => l.id === leaderId);
    toast({
      title: `${action} ${leader?.name}`,
      description: `Action "${action}" performed on ${leader?.name}`,
    });
  };

  return {department,loading,showNewTicket,setShowNewTicket,tickets,date,selectedDateTickets,handleTeamAction,handleLeaderAction,setDate,calendarEvents};
}
