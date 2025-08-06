// Defines the structure for a single team member on the detail page.
export interface TeamMember {
  id: string;
  name: string;
  role: "leader" | "member";
  avatar: string;
  status: "online" | "away" | "offline";
  email: string;
  joinedDate: string;
}

// Defines the structure for a single team, including its members.
export interface TeamDetail {
  id: string;
  name: string;
  description: string;
  department: string;
  memberCount: number;
  activeProjects: number;
  lead: {
    name: string;
    avatar: string;
    id: string;
  };
  status: "active" | "inactive";
  createdAt: string;
  members: TeamMember[];
}

// Defines the structure for a ticket associated with a team.
export interface TeamTicket {
  id: string;
  title: string;
  type: "task" | "meeting" | "event";
  status: "in_progress" | "scheduled" | "pending" | "verified";
  assignee: string | null;
  dueDate: string;
  messages: number;
  lastActivity: string;
  // Note: Dates will be passed as strings (ISO format) from server to client.
}
