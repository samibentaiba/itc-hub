// src/server/admin/teams.ts
import { prisma } from "@/lib/prisma";
import { teamFormSchema } from "@/app/(protected)/admin/types";
import { z } from "zod";
import { MembershipRole } from "@prisma/client";

/**
 * Retrieves a list of all teams with their member count and leader names.
 */
export async function listTeams() {
  const teams = await prisma.team.findMany({
    include: {
      _count: {
        select: { members: true },
      },
      members: {
        where: { role: MembershipRole.LEADER },
        include: {
          user: {
            select: { name: true },
          },
        },
      },
      department: {
        select: { name: true },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return teams.map((team) => ({
    id: team.id,
    name: team.name,
    description: team.description,
    departmentId: team.departmentId,
    departmentName: team.department.name,
    memberCount: team._count.members,
    leaders: team.members.map((m) => m.user.name).join(", "),
  }));
}

/**
 * Creates a new team.
 */
export async function createTeam(data: z.infer<typeof teamFormSchema>) {
  const validatedData = teamFormSchema.parse(data);
  return await prisma.team.create({
    data: validatedData,
  });
}

/**
 * Updates an existing team.
 */
export async function updateTeam(teamId: string, data: z.infer<typeof teamFormSchema>) {
  const validatedData = teamFormSchema.parse(data);
  return await prisma.team.update({
    where: { id: teamId },
    data: validatedData,
  });
}

/**
 * Deletes a team.
 */
export async function deleteTeam(teamId: string) {
  return await prisma.team.delete({
    where: { id: teamId },
  });
}

/**
 * Adds a member to a team.
 */
export async function addTeamMember(
  teamId: string,
  userId: string,
  role: MembershipRole
) {
  return await prisma.teamMember.create({
    data: {
      teamId,
      userId,
      role,
    },
  });
}

/**
 * Removes a member from a team.
 */
export async function removeTeamMember(teamId: string, userId: string) {
  return await prisma.teamMember.delete({
    where: {
      teamId_userId: {
        teamId,
        userId,
      },
    },
  });
}

/**
 * Updates a member's role within a team.
 */
export async function updateTeamMemberRole(
  teamId: string,
  userId: string,
  role: MembershipRole
) {
  return await prisma.teamMember.update({
    where: {
      teamId_userId: {
        teamId,
        userId,
      },
    },
    data: { role },
  });
}
