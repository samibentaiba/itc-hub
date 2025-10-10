// src/app/(protected)/calendar/global/page.tsx

import { headers } from "next/headers";
import { Event } from "@prisma/client";
import GlobalCalendarClientPage from "./client";

// Helper function for authenticated server-side fetch requests
async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const headersList = await headers();
  const cookie = headersList.get("cookie");

  return fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(cookie && { Cookie: cookie }),
      ...options.headers,
    },
  });
}

// This is a Server Component.
// It fetches data on the server and passes it to the client component.
export default async function GlobalCalendarPage() {
  let globalEvents: Event[] = [];
  let departments: any[] = [];
  let teams: any[] = [];

  try {
    // Fetch all events for global view
    const response = await authenticatedFetch("/api/events?all=true");

    if (!response.ok) {
      console.error("Failed to fetch global calendar data:", response.status);
      // Continue with empty array instead of throwing
    } else {
      const data = await response.json();
      globalEvents = data.events || [];
    }

    // Fetch departments and teams for the "Add Event" form
    const deptsResponse = await authenticatedFetch("/api/departments");
    if (deptsResponse.ok) {
      departments = (await deptsResponse.json()).departments || [];
    }

    const teamsResponse = await authenticatedFetch("/api/teams");
    if (teamsResponse.ok) {
      teams = (await teamsResponse.json()).teams || [];
    }
  } catch (error) {
    console.error("Error fetching global calendar data:", error);
    // Continue with empty array
  }

  // Transform events to match the expected format
  const transformedEvents: Event[] = globalEvents.map((event: Event) => ({
    ...event,
    id: event.id,
    title: event.title,
    description: event.description,
    date: new Date(event.date),
    time: event.time,
    duration: event.duration,
    type: event.type,
    status: event.status,
    location: event.location,
    color: getEventColor(event.type),
    organizerId: event.organizerId,
    isRecurring: event.isRecurring,
    createdAt: new Date(event.createdAt),
    updatedAt: new Date(event.updatedAt),
    departmentId: event.departmentId,
    teamId: event.teamId,
  }));

  const now = new Date();
  const upcomingEvents = transformedEvents
    .filter((event) => new Date(event.date) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5)
    .map((event) => ({
      id: event.id,
      title: event.title,
      date: new Date(event.date).toLocaleDateString(),
      type: event.type as string,
    }));

  // Pass the server-fetched data as props to the client component.
  return (
    <GlobalCalendarClientPage
      initialEvents={transformedEvents}
      initialUpcomingEvents={upcomingEvents}
      availableWorkspaces={[
        ...departments.map((d) => ({
          id: d.id,
          name: d.name,
          type: "department",
        })),
        ...teams.map((t) => ({ id: t.id, name: t.name, type: "team" })),
      ]}
    />
  );
}

function getEventColor(type: string) {
  const colorMap: { [key: string]: string } = {
    MEETING: "bg-blue-500",
    REVIEW: "bg-green-500",
    PLANNING: "bg-purple-500",
    WORKSHOP: "bg-orange-500",
  };
  return colorMap[type] || "bg-gray-500";
}
