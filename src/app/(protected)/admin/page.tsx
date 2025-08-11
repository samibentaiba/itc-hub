// /admin/page.tsx

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { fetchUsers, fetchTeams, fetchDepartments, fetchEvents, fetchUpcomingEvents,fetchPendingEvents } from "./api";
import AdminClientPage from "./client";

/**
 * The main server component for the /admin route.
 * It fetches all initial data on the server, allowing for
 * efficient data loading and enabling Suspense for a better UX.
 */
export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  // Check if the user is an admin. If not, redirect them to the dashboard.
  console.log("Session:", session);

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
  
      <AdminClientPage
        initialUsers={initialUsers}
        initialTeams={initialTeams}
        initialDepartments={initialDepartments}
        initialEvents={initialEvents}
        initialUpcomingEvents={initialUpcomingEvents}
        initialPendingEvents={initialPendingEvents}
      />

  );
}
