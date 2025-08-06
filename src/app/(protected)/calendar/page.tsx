// /calendar/page.tsx

import { fetchEvents, fetchUpcomingEvents } from "./api";
import CalendarClientPage from "./client";

/**
 * The main server component for the calendar page.
 * It fetches initial event data on the server and passes it
 * to the client component for rendering and interaction. This pattern
 * leverages Next.js App Router features for optimal performance.
 */
export default async function CalendarPage() {
  // Fetch initial data in parallel on the server for faster loading.
  // The `loading.tsx` component will be displayed to the user while these
  // promises are resolving.
  const [initialEvents, initialUpcomingEvents] = await Promise.all([
    fetchEvents(),
    fetchUpcomingEvents(),
  ]);

  // The fetched data is passed as props to the client component.
  // This avoids client-side data fetching waterfalls and ensures the
  // UI is rendered with data from the very beginning.
  return (
    <CalendarClientPage
      initialEvents={initialEvents}
      initialUpcomingEvents={initialUpcomingEvents}
    />
  );
}
