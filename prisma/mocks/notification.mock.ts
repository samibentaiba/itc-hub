import { Notification, NotificationType } from "@prisma/client";

const notifications: Omit<Notification, "id" | "time" | "unread" | "user">[] = [
  {
    userId: "USER-003",
    title: "New Ticket Assigned",
    description:
      "You have been assigned to ticket: Login button unresponsive on Firefox",
    type: NotificationType.ASSIGNMENT,
  },
  {
    userId: "USER-005",
    title: "New Ticket Assigned",
    description:
      "You have been assigned to ticket: API endpoint /api/users returning 500 error",
    type: NotificationType.ASSIGNMENT,
  },
];

export default notifications;
