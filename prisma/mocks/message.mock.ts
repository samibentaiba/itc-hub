import { Message } from "@prisma/client";

const messages: Omit<
  Message,
  "reactions" | "edited" | "files" | "sender" | "ticket"
>[] = [
  {
    id: "COMMENT-001",
    ticketId: "TICKET-001",
    senderId: "USER-007",
    content:
      "I've replicated this on Firefox v130. It seems to be an issue with a recent update.",
    type: "text",
    timestamp: new Date("2025-08-11T10:05:00Z"),
  },
  {
    id: "COMMENT-002",
    ticketId: "TICKET-001",
    senderId: "USER-003",
    content:
      "Thanks for the report. I'm looking into it now. It might be related to the new CSS changes.",
    type: "text",
    timestamp: new Date("2025-08-11T11:35:00Z"),
  },
];
export default messages;
