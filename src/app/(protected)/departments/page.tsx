import { getDepartments } from "@/lib/data-services";
import DepartmentsClientPage from "./client";

// This is the Server Component.
// Its only job is to fetch data on the server.
export default async function DepartmentsPage() {
  // Fetch departments data
  const departments = await getDepartments();

  // Generate stats from the departments data
  const stats = [
    {
      title: "Total Departments",
      value: departments.length.toString(),
      description: "Active departments",
      trend: "+2 this quarter"
    },
    {
      title: "Total Teams",
      value: departments.reduce((sum, dept) => sum + (dept.teams?.length || 0), 0).toString(),
      description: "Across all departments",
      trend: "+3 this month"
    },
    {
      title: "Total Members",
      value: departments.reduce((sum, dept) => sum + (dept.memberCount || 0), 0).toString(),
      description: "Active employees",
      trend: "+12 this quarter"
    },
    {
      title: "Open Positions",
      value: "7",
      description: "Currently hiring",
      trend: "+2 this week"
    }
  ];

  // Transform departments to match the expected format
  const transformedDepartments = departments.map(dept => ({
    id: dept.id || '',
    name: dept.name || '',
    description: dept.description || '',
    head: {
      name: dept.manager?.name || 'Unknown',
      avatar: dept.manager?.avatar || '',
      id: dept.manager?.id || ''
    },
    teamCount: dept.teams?.length || 0,
    memberCount: dept.memberCount || 0,
    status: "active" as const,
    recentActivity: "Recent activity",
    color: "#3b82f6",
    teams: dept.teams?.map(team => ({
      name: team.name || '',
      memberCount: team.memberCount || 0
    })) || []
  }));

  // Pass the fetched data as props to the Client Component.
  return (
    <DepartmentsClientPage 
      initialDepartments={transformedDepartments} 
      initialStats={stats} 
    />
  );
}
