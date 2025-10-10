import CalendarClientPage from "./client";
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
export default async function CalendarPage() {
  let events: ApiEvent[] = [];
  
  try {
    // Fetch all events first, then filter on frontend if needed
    const response = await authenticatedFetch('/api/events?type=personal&limit=100');
    
    if (!response.ok) {
      console.error('Failed to fetch calendar data:', response.status);
      // Continue with empty array instead of throwing
    } else {
      const data = await response.json();
      events = data.events || [];
    }
  } catch (error) {
    console.error('Error fetching calendar data:', error);
    // Continue with empty array
  }

  console.log('Fetched events for personal calendar:', events.length);

  // Transform events to match the expected format
  const transformedEvents = events.map((event: ApiEvent) => ({
    id: event.id,
    title: event.title || 'Untitled Event',
    description: event.description || '',
    date: event.date ? new Date(event.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    time: event.time || '09:00',
    duration: event.duration || 60,
    type: event.type || 'meeting',
    attendees: event.participants?.map((p) => p.name || p.email || '') || 
               event.attendees?.map((a) => a.name || a.email || '') || 
               ['You'],
    location: event.location || 'TBD',
    color: getEventColor(event.type || 'meeting')
  }));

  // Generate upcoming events (next 5 events)
  const now = new Date();
  const upcomingEvents = events
    .filter((event: ApiEvent) => new Date(event.date) >= now)
    .sort((a: ApiEvent, b: ApiEvent) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5)
    .map((event: ApiEvent) => ({
      id: event.id,
      title: event.title || 'Untitled Event',
      date: new Date(event.date).toLocaleDateString(),
      type: event.type || 'meeting',
      attendees: event.participants?.length || event.attendees?.length || 1
    }));

  console.log('Transformed events:', transformedEvents.length);
  console.log('Upcoming events:', upcomingEvents.length);

  // Pass the server-fetched data as props to the client component.
  return (
    <CalendarClientPage 
      initialEvents={transformedEvents} 
      initialUpcomingEvents={upcomingEvents} 
    />
  );
}

// Helper function to get colors for different event types
function getEventColor(type: string): string {
  const colorMap: { [key: string]: string } = {
    'meeting': 'bg-blue-500',
    'team-event': 'bg-green-500', 
    'department-event': 'bg-purple-500',
    'workshop': 'bg-orange-500',
    'deadline': 'bg-red-500',
    'personal': 'bg-indigo-500'
  };
  return colorMap[type] || 'bg-gray-500';
}