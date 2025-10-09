// src/lib/auth-helpers.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export interface AuthSession {
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export async function getAuthenticatedUser(): Promise<AuthSession | null> {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return null;
  }

  return session as AuthSession;
}

export async function getUser(
  userId: string
): Promise<{
  role: string;
  email: string;
  name: string;
  avatar: string | null;
} | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true, email: true, name: true, avatar: true },
  });
  if (!user) return null;
  else return user;
}
export async function isAdmin(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  return user?.role === "ADMIN";
}

export async function isTeamManager(
  userId: string,
  teamId: string
): Promise<boolean> {
  // Check if user is a manager in the team membership
  const membership = await prisma.teamMember.findUnique({
    where: {
      userId_teamId: {
        userId: userId,
        teamId: teamId,
      },
    },
    select: { role: true },
  });

  return membership?.role === "MANAGER";
}

export async function isDepartmentManager(
  userId: string,
  departmentId: string
): Promise<boolean> {
  // Check if user is a manager in the department membership
  const membership = await prisma.departmentMember.findUnique({
    where: {
      userId_departmentId: {
        userId: userId,
        departmentId: departmentId,
      },
    },
    select: { role: true },
  });

  return membership?.role === "MANAGER";
}

export async function isTicketCreator(
  userId: string,
  ticketId: string
): Promise<boolean> {
  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    select: { createdById: true },
  });

  return ticket?.createdById === userId;
}

export async function canAccessTeam(
  userId: string,
  teamId: string
): Promise<boolean> {
  // Admin can access all teams
  if (await isAdmin(userId)) {
    return true;
  }

  // Check if user is a member of the team
  const membership = await prisma.teamMember.findUnique({
    where: {
      userId_teamId: {
        userId: userId,
        teamId: teamId,
      },
    },
  });

  return !!membership;
}

export async function canAccessDepartment(
  userId: string,
  departmentId: string
): Promise<boolean> {
  // Admin can access all departments
  if (await isAdmin(userId)) {
    return true;
  }

  // Check if user is a member of the department
  const membership = await prisma.departmentMember.findUnique({
    where: {
      userId_departmentId: {
        userId: userId,
        departmentId: departmentId,
      },
    },
  });

  return !!membership;
}

export async function canManageTeam(
  userId: string,
  teamId: string
): Promise<boolean> {
  return (await isAdmin(userId)) || (await isTeamManager(userId, teamId));
}

export async function canManageDepartment(
  userId: string,
  departmentId: string
): Promise<boolean> {
  return (
    (await isAdmin(userId)) || (await isDepartmentManager(userId, departmentId))
  );
}

export async function canManageTicket(
  userId: string,
  ticketId: string
): Promise<boolean> {
  if (await isAdmin(userId)) {
    return true;
  }

  // Check if user created the ticket
  if (await isTicketCreator(userId, ticketId)) {
    return true;
  }

  // Check if user is a manager of the team/department the ticket belongs to
  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    select: {
      teamId: true,
      departmentId: true,
    },
  });

  if (ticket?.teamId && (await isTeamManager(userId, ticket.teamId))) {
    return true;
  }

  if (
    ticket?.departmentId &&
    (await isDepartmentManager(userId, ticket.departmentId))
  ) {
    return true;
  }

  return false;
}
