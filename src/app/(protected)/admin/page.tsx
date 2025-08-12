// /admin/page.tsx

import { redirect } from "next/navigation";
import {
  fetchUsersAdmin,
  fetchTeamsAdmin,
  fetchDepartmentsAdmin,
  fetchEventsAdmin,
  fetchUpcomingEventsAdmin,
  fetchPendingEventsAdmin,
  fetchRole,
} from "../api";
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
    fetchUsersAdmin(),
    fetchTeamsAdmin(),
    fetchDepartmentsAdmin(),
    fetchEventsAdmin(),
    fetchUpcomingEventsAdmin(),
    fetchPendingEventsAdmin(),
  ]);
  const role = await fetchRole();
  if(role !== 'ADMIN') {
    redirect('/');
  }
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
