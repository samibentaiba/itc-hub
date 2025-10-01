import { Team } from "@prisma/client";

const teams: any[] = [
  {
    id: "TEAM-001",
    name: "Frontend",
    description: "Develops and maintains the user interface.",
    status: "active",
    departmentId: "DEP-001",
    leaders: {
      connect: [{ id: "USER-002" }, { id: "USER-003" }],
    },
  },
  {
    id: "TEAM-002",
    name: "Backend",
    description: "Manages the server-side logic and database.",
    status: "active",
    departmentId: "DEP-001",
    leaders: {
      connect: [{ id: "USER-004" }],
    },
  },
  {
    id: "TEAM-003",
    name: "Tier 1 Support",
    description: "First line of response for customer issues.",
    status: "active",
    departmentId: "DEP-002",
    leaders: {
      connect: [{ id: "USER-006" }],
    },
  },
  {
    id: "TEAM-004",
    name: "Tier 2 Support",
    description: "Handles escalated and technical support cases.",
    status: "active",
    departmentId: "DEP-002",
    leaders: {
      connect: [{ id: "USER-006" }],
    },
  },
  {
    id: "TEAM-005",
    name: "Management",
    description: "Company leadership.",
    status: "active",
    departmentId: "DEP-003",
    leaders: {
      connect: [{ id: "USER-001" }],
    },
  },
];
export default teams;
