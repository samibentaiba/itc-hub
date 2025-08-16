import { TeamMember, MembershipRole } from "@prisma/client";

const teamMembers: Omit<TeamMember, "id" | "joinedAt" | "team" | "user">[] = [
  {
    userId: "USER-002",
    teamId: "TEAM-001",
    role: MembershipRole.MANAGER,
  },
  {
    userId: "USER-003",
    teamId: "TEAM-001",
    role: MembershipRole.MEMBER,
  },
  {
    userId: "USER-004",
    teamId: "TEAM-002",
    role: MembershipRole.MANAGER,
  },
  {
    userId: "USER-005",
    teamId: "TEAM-002",
    role: MembershipRole.MEMBER,
  },
  {
    userId: "USER-006",
    teamId: "TEAM-003",
    role: MembershipRole.MANAGER,
  },
  {
    userId: "USER-007",
    teamId: "TEAM-003",
    role: MembershipRole.MEMBER,
  },
  {
    userId: "USER-008",
    teamId: "TEAM-004",
    role: MembershipRole.MEMBER,
  },
  {
    userId: "USER-001",
    teamId: "TEAM-005",
    role: MembershipRole.MANAGER,
  },
];
export default teamMembers;
