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
  let globalEvents = [];
  
  try {
    // Fetch global calendar data directly from API
    const response = await authenticatedFetch('/api/events?type=global');
    
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

  // Transform events to match the expected format
  const transformedEvents = globalEvents.map((event: any) => ({
    id: event.id,
    title: event.title,
    description: event.description || '',
    date: new Date(event.date || event.start),
    time: event.time || (event.start ? event.start.split('T')[1]?.split(':').slice(0, 2).join(':') : '09:00'),
    duration: '60 minutes',
    type: event.type || 'meeting',
    location: event.location || 'Conference Room',
    organizer: event.organizer?.name || 'System Admin',
    attendees: event.attendees?.length || event.participants?.length || 0,
    isRecurring: event.isRecurring || false
  }));

  // Pass the server-fetched data as props to the client component.
  return <GlobalCalendarClientPage initialGlobalEvents={transformedEvents} />;
}