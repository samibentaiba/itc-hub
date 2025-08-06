import TicketsClientPage from "./client";
import { fetchTickets, fetchStats } from "./api";

// This is a Server Component. 
// It fetches data on the server and passes it to the client component.
export default async function TicketsPage() {
  // --- Fetch data using the new API functions ---
  // These functions simulate a network request.
  const tickets = await fetchTickets();
  const stats = await fetchStats();
  // --- End of Data Fetching ---

  // Pass the server-fetched data as props to the client component.
  return (
    <TicketsClientPage 
      initialTickets={tickets} 
      initialStats={stats} 
    />
  );
}
