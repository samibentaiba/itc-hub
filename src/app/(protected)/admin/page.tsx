// /admin/page.tsx

import { fetchUsers, fetchTeams, fetchDepartments, fetchEvents, fetchUpcomingEvents,fetchPendingEvents } from "./api";
import AdminClientPage from "./client";
import { Suspense } from "react";
import AdminLoading from "./loading";

/**
 * The main server component for the /admin route.
 * It fetches all initial data on the server, allowing for
 * efficient data loading and enabling Suspense for a better UX.
 */
export default async function AdminPage() {
  // Fetch all data in parallel to minimize load times.
  // The `loading.tsx` component will be shown while this is in progress.
  const [
    initialUsers,
    initialTeams,
    initialDepartments,
    initialEvents,
    initialUpcomingEvents,initialPendingEvents
  ] = await Promise.all([
    fetchUsers(),
    fetchTeams(),
    fetchDepartments(),
    fetchEvents(),
    fetchUpcomingEvents(),
    fetchPendingEvents(),
  ]);

  // Pass the server-fetched data as props to the Client Component.
  return (
    <Suspense fallback={<AdminLoading />}>
      <AdminClientPage
        initialUsers={initialUsers}
        initialTeams={initialTeams}
        initialDepartments={initialDepartments}
        initialEvents={initialEvents}
        initialUpcomingEvents={initialUpcomingEvents}
        initialPendingEvents={initialPendingEvents}
      />
    </Suspense>
  );
}
