const departments: Array<{
  id: string;
  name: string;
  description: string;
  status: string;
  color: string;
  managers: {
    connect: Array<{ id: string }>;
  };
}> = [
  {
    id: "DEP-001",
    name: "Engineering",
    description: "Responsible for all software development and product engineering.",
    status: "active",
    color: "#3b82f6",
    managers: {
      connect: [{ id: "USER-002" }, { id: "USER-004" }],
    },
  },
  {
    id: "DEP-002",
    name: "Support",
    description: "Dedicated to providing world-class customer support.",
    status: "active",
    color: "#10b981",
    managers: {
      connect: [{ id: "USER-006" }],
    },
  },
  {
    id: "DEP-003",
    name: "Executive",
    description: "High-level company leadership.",
    status: "active",
    color: "#8b5cf6",
    managers: {
      connect: [{ id: "USER-001" }],
    },
  },
  {
    id: "DEP-004",
    name: "Marketing",
    description: "Responsible for all marketing and communication.",
    status: "active",
    color: "#ec4899",
    managers: {
      connect: [{ id: "USER-008" }],
    },
  }
];

export default departments;