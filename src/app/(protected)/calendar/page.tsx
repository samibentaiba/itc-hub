// /calendar/page.tsx

import CalendarClientPage from "./client";
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
export default async function CalendarPage() {
  // Fetch personal calendar data directly from API
  const response = await authenticatedFetch('/api/events?type=personal');
  if (!response.ok) {
    throw new Error('Failed to fetch personal calendar data');
  }
  const data = await response.json();
  const events = data.events || [];

  // Transform events to match the expected format
  const transformedEvents = events.map((event, index) => ({
    id: parseInt(event.id),
    title: event.title,
    description: event.description,
    date: event.start.split('T')[0],
    time: event.start.split('T')[1]?.split(':').slice(0, 2).join(':') || '00:00',
    duration: 60, // Default duration
    type: event.type,
    attendees: event.participants?.map(p => p.name || '') || [],
    location: event.location || '',
    color: event.type === 'meeting' ? '#3b82f6' : '#10b981'
  }));

  // Generate upcoming events
  const upcomingEvents = events.slice(0, 5).map((event, index) => ({
    id: parseInt(event.id),
    title: event.title,
    date: new Date(event.start).toLocaleDateString(),
    type: event.type,
    attendees: event.participants?.length || 0
  }));

  // Pass the server-fetched data as props to the client component.
  return (
    <CalendarClientPage 
      initialEvents={transformedEvents} 
      initialUpcomingEvents={upcomingEvents} 
    />
  );
}
