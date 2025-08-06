export type Department = {
  id: string;
  name: string;
  description: string;
  head: {
    name: string;
    avatar: string;
    id: string;
  };
  teamCount: number;
  memberCount: number;
  budget: string;
  status: string;
  createdAt: string;
};

export type Leader = {
  id: string;
  name: string;
  role: "super_leader" | "leader";
  avatar: string;
  status: "online" | "offline";
  email: string;
  joinedDate: string;
};

export type Team = {
  id: string;
  name: string;
  memberCount: number;
  leader: string;
  status: "active" | "planning" | "archived";
};

export type Ticket = {
  id: string;
  title: string;
  type: "meeting" | "task" | "event";
  status: "in_progress" | "pending" | "scheduled";
  assignee: string | null;
  duration: string;
  messages: number;
  lastActivity: string;
  collaborative: boolean;
  calendarDate: Date;
  collaborators: string[];
};