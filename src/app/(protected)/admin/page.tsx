// /admin/page.tsx

import { fetchUsers, fetchTeams, fetchDepartments } from "./api";
import AdminClientPage from "./client";

/**
 * The main server component for the /admin route.
 * It fetches all initial data on the server, allowing for
 * efficient data loading and enabling Suspense for a better UX.
 */
export default async function AdminPage() {
  // Fetch all data in parallel to minimize load times.
  // The `loading.tsx` component will be shown while this is in progress.
  const [initialUsers, initialTeams, initialDepartments] = await Promise.all([
    fetchUsers(),
    fetchTeams(),
    fetchDepartments(),
  ]);

  // Pass the server-fetched data as props to the Client Component.
  return (
    <AdminClientPage
      initialUsers={initialUsers}
      initialTeams={initialTeams}
      initialDepartments={initialDepartments}
    />
  );
}
