// Defines the structure for a single department.
export interface Department {
  id: string;
  name: string;
  description: string;
  head: {
    name: string;
    avatar: string;
    id:string;
  };
  teamCount: number;
  memberCount: number;
  budget: string;
  teams: Array<{ name: string; memberCount: number }>;
  recentActivity: string;
  status: string;
  color: string;
}

// Defines the structure for a single stat card.
// The 'icon' property is removed because React components cannot be passed from Server to Client Components.
export interface DepartmentStat {
  title: string;
  value: string;
  description: string;
  trend: string;
}
