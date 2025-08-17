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
  let events = [];
  
  try {
    // Fetch personal calendar data directly from API
    const response = await authenticatedFetch('/api/events?type=personal');
    
    if (!response.ok) {
      console.error('Failed to fetch personal calendar data:', response.status);
      // Continue with empty array instead of throwing
    } else {
      const data = await response.json();
      events = data.events || [];
    }
  } catch (error) {
    console.error('Error fetching personal calendar data:', error);
    // Continue with empty array
  }

  // Transform events to match the expected format
  const transformedEvents = events.map((event: any, index: number) => ({
    id: parseInt(event.id) || index + 1,
    title: event.title || 'Untitled Event',
    description: event.description || '',
    date: event.date ? event.date.split('T')[0] : (event.start ? event.start.split('T')[0] : new Date().toISOString().split('T')[0]),
    time: event.time || (event.start ? event.start.split('T')[1]?.split(':').slice(0, 2).join(':') : '09:00'),
    duration: event.duration || 60, // Default duration
    type: event.type || 'meeting',
    attendees: event.participants?.map((p: any) => p.name || '') || ['You'],
    location: event.location || 'Virtual',
    color: event.type === 'meeting' ? 'bg-blue-500' : 'bg-green-500'
  }));

  // Generate upcoming events
  const upcomingEvents = events.slice(0, 5).map((event: any, index: number) => ({
    id: parseInt(event.id) || index + 1,
    title: event.title || 'Untitled Event',
    date: event.date ? new Date(event.date).toLocaleDateString() : new Date().toLocaleDateString(),
    type: event.type || 'meeting',
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