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
    emailVerified: new Date(),
    email: "sami.bentaiba@example.com",
    name: "Sami Bentaiba",
    password: "password123",
    role: Role.ADMIN,
    avatar: "https://avatar.iran.liara.run/public",
    status: "verified",
  },
  {
    id: "USER-002",
    emailVerified: new Date(),
    email: "jane.doe@example.com",
    name: "Jane Doe",
    password: "password123",
    role: Role.MANAGER,
    avatar: "https://avatar.iran.liara.run/public/boy",
    status: "verified",
  },
  {
    id: "USER-003",
    emailVerified: new Date(),
    email: "john.smith@example.com",
    name: "John Smith",
    password: "password123",
    role: Role.USER,
    avatar: "https://avatar.iran.liara.run/public/boy",
    status: "verified",
  },
  {
    id: "USER-004",
    emailVerified: new Date(),
    email: "peter.jones@example.com",
    name: "Peter Jones",
    password: "password123",
    role: Role.MANAGER,
    avatar: "https://avatar.iran.liara.run/public/boy",
    status: "verified",
  },
  {
    id: "USER-005",
    emailVerified: new Date(),
    email: "mary.williams@example.com",
    name: "Mary Williams",
    password: "password123",
    role: Role.USER,
    avatar: "https://avatar.iran.liara.run/public/girl",
    status: "verified",
  },
  {
    id: "USER-006",
    emailVerified: new Date(),
    email: "david.brown@example.com",
    name: "David Brown",
    password: "password123",
    role: Role.MANAGER,
    avatar: "https://avatar.iran.liara.run/public/boy",
    status: "verified",
  },
  {
    id: "USER-007",
    emailVerified: new Date(),
    email: "patricia.garcia@example.com",
    name: "Patricia Garcia",
    password: "password123",
    role: Role.USER,
    avatar: "https://avatar.iran.liara.run/public/girl",
    status: "verified",
  },
  {
    id: "USER-008",
    emailVerified: new Date(),
    email: "michael.miller@example.com",
    name: "Michael Miller",
    password: "password123",
    role: Role.USER,
    avatar: "https://avatar.iran.liara.run/public/boy",
    status: "verified",
  },
];
export default users;
