import { Team } from "@prisma/client";

const teams: Omit<
  Team,
  "createdAt" | "updatedAt" | "department" | "leader" | "members" | "tickets"
>[] = [
  {
    id: "TEAM-001",
    name: "Frontend",
    description: "Develops and maintains the user interface.",
    status: "active",
    departmentId: "DEP-001",
    leaderId: "USER-002",
  },
  {
    id: "TEAM-002",
    name: "Backend",
    description: "Manages the server-side logic and database.",
    status: "active",
    departmentId: "DEP-001",
    leaderId: "USER-004",
  },
  {
    id: "TEAM-003",
    name: "Tier 1 Support",
    description: "First line of response for customer issues.",
    status: "active",
    departmentId: "DEP-002",
    leaderId: "USER-006",
  },
  {
    id: "TEAM-004",
    name: "Tier 2 Support",
    description: "Handles escalated and technical support cases.",
    status: "active",
    departmentId: "DEP-002",
    leaderId: "USER-006",
  },
  {
    id: "TEAM-005",
    name: "Management",
    description: "Company leadership.",
    status: "active",
    departmentId: "DEP-003",
    leaderId: "USER-001",
  },
];
export default teams;
