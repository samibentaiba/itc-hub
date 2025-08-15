import TicketsClientPage from "./client";
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
export default async function TicketsPage() {
  // Fetch tickets data directly from API
  const response = await authenticatedFetch('/api/tickets');
  if (!response.ok) {
    throw new Error('Failed to fetch tickets');
  }
  const ticketsData = await response.json();

  // Transform tickets to match the expected format
  const tickets = ticketsData.tickets.map(ticket => ({
    id: ticket.id || '',
    title: ticket.title || '',
    description: ticket.description || '',
    status: (ticket.status === 'open' ? 'new' : ticket.status === 'in_progress' ? 'in-progress' : 'resolved') as 'new' | 'in-progress' | 'resolved',
    priority: (ticket.priority || 'medium') as 'low' | 'medium' | 'high' | 'urgent',
    type: 'Task' as 'Task' | 'Bug' | 'Feature',
    from: ticket.department?.name || ticket.team?.name || 'Unknown',
    assignee: {
      name: ticket.assignee?.name || 'Unassigned',
      avatar: ticket.assignee?.avatar || '',
      id: ticket.assignee?.id || ''
    },
    reporter: {
      name: ticket.reporter?.name || 'System',
      avatar: ticket.reporter?.avatar || '',
      id: ticket.reporter?.id || ''
    },
    createdAt: ticket.createdAt || new Date().toISOString(),
    updatedAt: ticket.updatedAt || new Date().toISOString(),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    comments: 0
  }));

  // Generate stats from the tickets data
  const stats = [
    {
      title: "Total Tickets",
      value: ticketsData.tickets.length.toString(),
      description: "All time",
      trend: "+12 this month"
    },
    {
      title: "Open Tickets",
      value: ticketsData.stats.open.toString(),
      description: "Need attention",
      trend: "+3 this week"
    },
    {
      title: "In Progress",
      value: ticketsData.stats.inProgress.toString(),
      description: "Being worked on",
      trend: "+5 this week"
    },
    {
      title: "Resolved",
      value: ticketsData.stats.closed.toString(),
      description: "This month",
      trend: "+18 this month"
    }
  ];

  // Pass the server-fetched data as props to the client component.
  return (
    <TicketsClientPage 
      initialTickets={tickets} 
      initialStats={stats} 
    />
  );
}
