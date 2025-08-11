// /admin/page.tsx
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { fetchUsers, fetchTeams, fetchDepartments, fetchEvents, fetchUpcomingEvents,fetchPendingEvents } from "./api";
import AdminClientPage from "./client";
import { currentUser } from "@/lib/user"; // Import the new helper
/**
 * The main server component for the /admin route.
 * It fetches all initial data on the server, allowing for
 * efficient data loading and enabling Suspense for a better UX.
 */
export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  // Check if the user is an admin. If not, redirect them to the dashboard.
 const user = await currentUser();

  // Check the role from the live database data. If not an admin, redirect.
  console.log("Current user:", user);
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
