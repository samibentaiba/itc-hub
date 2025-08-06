// src/app/(protected)/tickets/types.d.ts

// Define and export the structure of a Ticket
export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: "open" | "in-progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  assignee: {
    name: string;
    avatar: string;
    id: string;
  };
  reporter: {
    name: string;
    avatar: string;
    id: string;
  };
  createdAt: string;
  updatedAt: string;
  comments: number;
  team: string;
}

// Define and export the structure for stats
export interface Stat {
  title: string;
  value: string;
  description: string;
  trend: string;
}
