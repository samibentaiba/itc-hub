
import { fetchUserStats, fetchUsers } from "../api";
import UsersClientPage from "./client";

export default async function UsersPage() {
  const [initialStats, initialUsers] = await Promise.all([
    fetchUserStats(),
    fetchUsers(),
  ]);
  return <UsersClientPage initialStats={initialStats} initialUsers={initialUsers} />;
}
