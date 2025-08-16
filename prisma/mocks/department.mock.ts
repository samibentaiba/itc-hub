import { Department } from "@prisma/client";

const departments: Omit<
  Department,
  | "createdAt"
  | "updatedAt"
  | "events"
  | "manager"
  | "members"
  | "teams"
  | "tickets"
>[] = [
  {
    id: "DEP-001",
    name: "Engineering",
    description:
      "Responsible for all software development and product engineering.",
    status: "active",
    color: "#3b82f6",
    managerId: "USER-002",
  },
  {
    id: "DEP-002",
    name: "Support",
    description: "Dedicated to providing world-class customer support.",
    status: "active",
    color: "#10b981",
    managerId: "USER-006",
  },
  {
    id: "DEP-003",
    name: "Executive",
    description: "High-level company leadership.",
    status: "active",
    color: "#8b5cf6",
    managerId: "USER-001",
  },
];
export default departments;
