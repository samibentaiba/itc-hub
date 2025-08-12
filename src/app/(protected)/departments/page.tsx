import { fetchDepartments, fetchDepartmentStats } from "../api";
import DepartmentsClientPage from "./client";

// This is the Server Component.
// Its only job is to fetch data on the server.
export default async function DepartmentsPage() {
  // Fetch the initial data in parallel.
  const [departments, stats] = await Promise.all([
    fetchDepartments(),
    fetchDepartmentStats(),
  ]);

  // Pass the fetched data as props to the Client Component.
  return (
    <DepartmentsClientPage 
      initialDepartments={departments} 
      initialStats={stats} 
    />
  );
}
