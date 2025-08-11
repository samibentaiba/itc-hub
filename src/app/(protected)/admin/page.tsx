// /admin/page.tsx

import {
  fetchUsers,
  fetchTeams,
  fetchDepartments,
  fetchEvents,
  fetchUpcomingEvents,
  fetchPendingEvents,
} from "./api";
import AdminClientPage from "./client";
export default async function AdminPage() {
  const [
    initialUsers,
    initialTeams,
    initialDepartments,
    initialEvents,
    initialUpcomingEvents,
    initialPendingEvents,
  ] = await Promise.all([
    fetchUsers(),
    fetchTeams(),
    fetchDepartments(),
    fetchEvents(),
    fetchUpcomingEvents(),
    fetchPendingEvents(),
  ]);
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
