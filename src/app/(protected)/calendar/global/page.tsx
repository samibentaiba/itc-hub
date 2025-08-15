// src/app/(protected)/calendar/global/page.tsx

import GlobalCalendarClientPage from "./client";
import { headers } from 'next/headers';

// Helper function for authenticated server-side fetch requests
async function authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const headersList = await headers();
  const cookie = headersList.get('cookie');
  
  return fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(cookie && { Cookie: cookie }),
      ...options.headers,
    },
  });
}

// This is a Server Component. 
// It fetches data on the server and passes it to the client component.
export default async function GlobalCalendarPage() {
  // Fetch global calendar data directly from API
  const response = await authenticatedFetch('/api/events?type=global');
  if (!response.ok) {
    throw new Error('Failed to fetch global calendar data');
  }
  const data = await response.json();
  const globalEvents = data.events || [];

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
