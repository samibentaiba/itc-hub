// src/app/(protected)/calendar/global/page.tsx

import GlobalCalendarClientPage from "./client";
import { getGlobalCalendarData } from "@/lib/server-api";

// This is a Server Component. 
// It fetches data on the server and passes it to the client component.
export default async function GlobalCalendarPage() {
  // Fetch global calendar data using the clean API
  const globalEvents = await getGlobalCalendarData();

  // Transform events to match the expected format
  const transformedEvents = globalEvents.map(event => ({
    id: event.id,
    title: event.title,
    description: event.description,
    date: new Date(event.start),
    time: event.start.split('T')[1]?.split(':').slice(0, 2).join(':') || '09:00',
    duration: '60 minutes',
    type: event.type,
    location: event.location || 'Conference Room',
    organizer: 'System Admin',
    attendees: event.participants?.length || 0,
    isRecurring: false
  }));

  // Pass the server-fetched data as props to the client component.
  return <GlobalCalendarClientPage initialEvents={transformedEvents} />;
}
