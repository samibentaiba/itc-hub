// src/types/tickets.ts
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

export interface Ticket {
    id: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    assignee: { name: string; avatar: string; id: string; };
    reporter: { name: string; avatar: string; id: string; };
    createdAt: string;
    updatedAt: string;
    team: string;
    labels: string[];
    type: string;
    workspace: string;
    workspaceType: string;
    dueDate: string;
}