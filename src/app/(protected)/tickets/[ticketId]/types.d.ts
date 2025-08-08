// src/app/(protected)/tickets/[ticketId]/types.d.ts

export interface Reaction {
  emoji: string;
  users: string[];
  count: number;
}

export interface Sender {
  id: string;
  name: string;
  avatar: string;
  role: "leader" | "member";
}

export interface Message {
  id: string;
  sender: Sender;
  content: string;
  type: "text" | "image" | "file" | "system";
  timestamp: string;
  reactions: Reaction[];
  edited: boolean;
  hasUrl?: boolean;
}

// This Ticket interface is now consistent with the /tickets page
export interface Ticket {
    id: string;
    title: string;
    description: string;
    status: "new" | "in-progress" | "resolved";
    priority: "low" | "medium" | "high" | "urgent";
    type: "Task" | "Bug" | "Feature";
    from: string; // The team or department name
    assignee: { name: string; avatar: string; id: string; };
    reporter: { name: string; avatar: string; id: string; };
    createdAt: string;
    updatedAt: string;
    dueDate: string;
    comments: number;
}
