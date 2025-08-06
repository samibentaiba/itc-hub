// /dashboard/page.tsx

import { fetchTickets, fetchWorkspaceStats } from "./api";
import DashboardClientPage from "./client";

/**
 * This is the main Server Component for the /dashboard route.
 * Its only job is to fetch data on the server, which allows for
 * efficient data loading and enables the use of Suspense for a
 * better loading experience.
 */
export default async function DashboardPage() {
  // Fetch the initial data in parallel to minimize the total load time.
  // The `loading.tsx` component will be shown while this data is being fetched.
  const [stats, tickets] = await Promise.all([
    fetchWorkspaceStats(),
    fetchTickets(),
  ]);

  // Pass the server-fetched data as props to the Client Component for rendering.
  // This avoids a client-side data fetching waterfall and ensures the page
  // is fully populated with data upon initial load.
  return (
    <DashboardClientPage
      initialStats={stats}
      initialTickets={tickets}
    />
  );
}
