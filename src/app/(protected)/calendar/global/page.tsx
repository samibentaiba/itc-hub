// src/app/(protected)/calendar/global/page.tsx

import GlobalCalendarClientPage from "./client";
import { headers } from 'next/headers';

interface ApiEvent {
  id: string;
  title: string;
  description: string;
  start: string;
  date: Date;
  time: string;
  duration: number;
  type: string;
  location: string;
  organizer: { id: string; name: string; email: string; avatar: string; };
  department: { id: string; name: string; color: string; };
  participants: { id: string; name: string; email: string; avatar: string; }[];
  attendees: { id: string; name: string; email: string; avatar: string; }[];
  isRecurring: boolean;
  createdAt: Date;
  updatedAt: Date;
}

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
  let globalEvents: ApiEvent[] = [];
  
  try {
    // Fetch all events for global view
    const response = await authenticatedFetch('/api/events?limit=100');
    
    if (!response.ok) {
      console.error('Failed to fetch global calendar data:', response.status);
      // Continue with empty array instead of throwing
    } else {
      const data = await response.json();
      globalEvents = data.events || [];
    }
  } catch (error) {
    console.error('Error fetching global calendar data:', error);
    // Continue with empty array
  }

  console.log('Fetched events for global calendar:', globalEvents.length);

  // Transform events to match the expected format
  const transformedEvents = globalEvents.map((event: ApiEvent) => ({
    id: event.id || Math.random().toString(),
    title: event.title || 'Untitled Event',
    description: event.description || '',
    date: new Date(event.date || event.start || new Date()),
    time: event.time || '09:00',
    duration: `${event.duration || 60} minutes`,
    type: event.type || 'meeting',
    location: event.location || 'TBD',
    organizer: event.organizer?.name || 'Unknown Organizer',
    attendees: event.participants?.length || event.attendees?.length || 0,
    isRecurring: event.isRecurring || false
  }));

  console.log('Transformed global events:', transformedEvents.length);

  // Pass the server-fetched data as props to the client component.
  return <GlobalCalendarClientPage initialGlobalEvents={transformedEvents} />;
}