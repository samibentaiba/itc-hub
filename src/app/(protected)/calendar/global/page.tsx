// src/app/(protected)/calendar/global/page.tsx

import { headers } from "next/headers";
import { Event } from "@prisma/client";
import GlobalCalendarClientPage from "./client";
import {
  Workspace,
  UpcomingEvent,
  DepartmentResponse,
  TeamResponse,
  EventsApiResponse,
  DepartmentsApiResponse,
  TeamsApiResponse,
} from "./types";

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

// Transform events to add color property
function transformEvents(events: Event[]): Event[] {
  return events.map((event) => ({
    ...event,
    date: new Date(event.date),
    createdAt: new Date(event.createdAt),
    updatedAt: new Date(event.updatedAt),
  }));
}

// Generate upcoming events list
function generateUpcomingEvents(events: Event[]): UpcomingEvent[] {
  const now = new Date();
  return events
    .filter((event) => new Date(event.date) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5)
    .map((event) => ({
      id: event.id,
      title: event.title,
      date: new Date(event.date).toLocaleDateString(),
      type: event.type as string,
    }));
}

// Transform departments and teams to workspace format
function transformWorkspaces(
  departments: DepartmentResponse[],
  teams: TeamResponse[]
): Workspace[] {
  return [
    ...departments.map((d) => ({
      id: d.id,
      name: d.name,
      type: "department" as const,
    })),
    ...teams.map((t) => ({
      id: t.id,
      name: t.name,
      type: "team" as const,
    })),
  ];
}

// This is a Server Component.
// It fetches data on the server and passes it to the client component.
export default async function GlobalCalendarPage() {
  let globalEvents: Event[] = [];
  let departments: DepartmentResponse[] = [];
  let teams: TeamResponse[] = [];

  try {
    // Fetch all events for global view
    const response = await authenticatedFetch("/api/events?all=true");

    if (!response.ok) {
      console.error("Failed to fetch global calendar data:", response.status);
      // Continue with empty array instead of throwing
    } else {
      const data: EventsApiResponse = await response.json();
      globalEvents = data.events || [];
    }

    // Fetch departments and teams for the "Add Event" form
    const deptsResponse = await authenticatedFetch("/api/departments");
    if (deptsResponse.ok) {
      const deptsData: DepartmentsApiResponse = await deptsResponse.json();
      departments = deptsData.departments || [];
    }

    const teamsResponse = await authenticatedFetch("/api/teams");
    if (teamsResponse.ok) {
      const teamsData: TeamsApiResponse = await teamsResponse.json();
      teams = teamsData.teams || [];
    }
  } catch (error) {
    console.error("Error fetching global calendar data:", error);
    // Continue with empty array
  }

  // Transform events to match the expected format
  const transformedEvents = transformEvents(globalEvents);

  // Generate upcoming events
  const upcomingEvents = generateUpcomingEvents(transformedEvents);

  // Transform workspaces
  const availableWorkspaces = transformWorkspaces(departments, teams);

  // Pass the server-fetched data as props to the client component.
  return (
    <GlobalCalendarClientPage
      initialEvents={transformedEvents}
      initialUpcomingEvents={upcomingEvents}
      availableWorkspaces={availableWorkspaces}
    />
  );
}