export interface UserStat {
  title: string;
  value: string;
  description: string;
  trend: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  department: string;
  status: "Active" | "Away" | "Offline";
  lastActive: string;
  projects: number;
}
