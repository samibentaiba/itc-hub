import { User, Role } from "@prisma/client";

const users: Omit<
  User,
  | "createdAt"
  | "updatedAt"
  | "accounts"
  | "assignedTickets"
  | "attendedEvents"
  | "collaboratingOnTickets"
  | "createdTickets"
  | "departments"
  | "files"
  | "ledTeams"
  | "managedDepartments"
  | "messages"
  | "notifications"
  | "organizedEvents"
  | "profile"
  | "sessions"
  | "teams"
>[] = [
  {
    id: "USER-001",
    email: "sami.bentaiba@example.com",
    name: "Sami Bentaiba",
    password: "password123",
    role: Role.ADMIN,
    avatar: "/avatars/sami.png",
    status: "verified",
  },
  {
    id: "USER-002",
    email: "jane.doe@example.com",
    name: "Jane Doe",
    password: "password123",
    role: Role.MANAGER,
    avatar: "/avatars/jane.png",
    status: "verified",
  },
  {
    id: "USER-003",
    email: "john.smith@example.com",
    name: "John Smith",
    password: "password123",
    role: Role.USER,
    avatar: "/avatars/john.png",
    status: "verified",
  },
  {
    id: "USER-004",
    email: "peter.jones@example.com",
    name: "Peter Jones",
    password: "password123",
    role: Role.MANAGER,
    avatar: "/avatars/peter.png",
    status: "verified",
  },
  {
    id: "USER-005",
    email: "mary.williams@example.com",
    name: "Mary Williams",
    password: "password123",
    role: Role.USER,
    avatar: "/avatars/mary.png",
    status: "verified",
  },
  {
    id: "USER-006",
    email: "david.brown@example.com",
    name: "David Brown",
    password: "password123",
    role: Role.MANAGER,
    avatar: "/avatars/david.png",
    status: "verified",
  },
  {
    id: "USER-007",
    email: "patricia.garcia@example.com",
    name: "Patricia Garcia",
    password: "password123",
    role: Role.USER,
    avatar: "/avatars/patricia.png",
    status: "verified",
  },
  {
    id: "USER-008",
    email: "michael.miller@example.com",
    name: "Michael Miller",
    password: "password123",
    role: Role.USER,
    avatar: "/avatars/michael.png",
    status: "verified",
  },
];
export default users;
