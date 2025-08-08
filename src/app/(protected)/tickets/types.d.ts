// src/app/(protected)/tickets/types.d.ts

// Define and export the structure of a Ticket
export interface Ticket {
  id: string;
  title: string;
  description: string;
  // UPDATED: Status values changed to match your requirements
  status: "new" | "in-progress" | "resolved"; 
  // ADDED: Priority field as requested
  priority: "low" | "medium" | "high" | "urgent"; 
  // ADDED: Type field as requested
  type: "Task" | "Bug" | "Feature"; 
  // ADDED: Workspace to show if it's from a team or department
  from: string; 
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
  dueDate: string;
  comments: number;
}

// Define and export the structure for stats
export interface Stat {
  title: string;
  value: string;
  description: string;
  trend: string;
}
