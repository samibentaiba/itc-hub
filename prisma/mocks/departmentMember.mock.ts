import { DepartmentMember, MembershipRole } from "@prisma/client";

const departmentMembers: Omit<DepartmentMember, "id" | "joinedAt">[] = [
  {
    userId: "USER-002",
    departmentId: "DEP-001",
    role: MembershipRole.MANAGER,
  },
  {
    userId: "USER-003",
    departmentId: "DEP-001",
    role: MembershipRole.MEMBER,
  },
  {
    userId: "USER-004",
    departmentId: "DEP-001",
    role: MembershipRole.MEMBER,
  },
  {
    userId: "USER-005",
    departmentId: "DEP-001",
    role: MembershipRole.MEMBER,
  },
  {
    userId: "USER-006",
    departmentId: "DEP-002",
    role: MembershipRole.MANAGER,
  },
  {
    userId: "USER-007",
    departmentId: "DEP-002",
    role: MembershipRole.MEMBER,
  },
  {
    userId: "USER-008",
    departmentId: "DEP-002",
    role: MembershipRole.MEMBER,
  },
  {
    userId: "USER-001",
    departmentId: "DEP-003",
    role: MembershipRole.MANAGER,
  },
];
export default departmentMembers;
