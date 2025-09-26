// /app/(home)/api.ts
import { prisma } from "@/lib/prisma";
import type { LandingPageData } from "./types";

export async function fetchLandingPageData(): Promise<LandingPageData> {
  // Live stats from DB
  const [activeMembers, activeProjects, completedTasks] = await Promise.all([
    prisma.user.count(),
    prisma.ticket.count({ where: { status: "OPEN" } }),
    prisma.ticket.count({ where: { status: "CLOSED" } }),
  ]);

  // Example success rate (closed vs total)
  const totalTickets = await prisma.ticket.count();
  const successRate = totalTickets
    ? Math.round((completedTasks / totalTickets) * 100)
    : 0;

  // Achievements could come from DB (hard-coded here for now)
  const achievements = [
    {
      id: "1",
      title: "Innovation Award",
      description: "Recognized for outstanding innovation.",
      type: "award",
      status: "completed",
      year: "2024",
      category: "innovation" as const,
    },
  ];

  // Upcoming events
  const events = await prisma.event.findMany({
    take: 3,
    where: { date: { gte: new Date() } },
    orderBy: { date: "asc" },
  });

  return {
    stats: {
      activeMembers: { count: activeMembers, change: "+5%", trend: "up" },
      activeProjects: { count: activeProjects, change: "+2", trend: "up" },
      completedTasks: { count: completedTasks, change: "+12", trend: "up" },
      successRate: { count: successRate, change: "+1%", trend: "stable" },
    },
    achievements,
    events: events.map((e) => ({
      id: e.id,
      title: e.title,
      type: e.type,
      location: e.location,
      status: "open",
      dueDate: e.date.toISOString(),
      registered: 0,
      organizer: e.organizerId ?? "",
      priority: "medium",
    })),
  };
}
