// src/server/admin/departments.ts
import { prisma } from "@/lib/prisma";
import { departmentFormSchema } from "@/app/(protected)/admin/types";
import { z } from "zod";
import { MembershipRole } from "@prisma/client";

/**
 * Retrieves a list of all departments with their member and team counts.
 */
export async function listDepartments() {
  return await prisma.department.findMany({
    include: {
      members: {
        include: {
          user: {
            select: { id: true, name: true, avatar: true },
          },
        },
      },
      teams: {
        select: {
          id: true,
          name: true,
        },
      },
      managers: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });
}

/**
 * Creates a new department.
 */
export async function createDepartment(data: z.infer<typeof departmentFormSchema>) {
  const validatedData = departmentFormSchema.parse(data);
  return await prisma.department.create({
    data: validatedData,
  });
}

/**
 * Updates an existing department.
 */
export async function updateDepartment(
  departmentId: string,
  data: z.infer<typeof departmentFormSchema>
) {
  const validatedData = departmentFormSchema.parse(data);
  return await prisma.department.update({
    where: { id: departmentId },
    data: validatedData,
  });
}

/**
 * Deletes a department and all of its associated teams and members.
 */
export async function deleteDepartment(departmentId: string) {
  // Prisma transactions ensure all operations succeed or none do.
  return await prisma.$transaction(async (tx) => {
    // First, delete all members within the department
    await tx.departmentMember.deleteMany({
      where: { departmentId: departmentId },
    });

    // Then, delete all teams within the department
    await tx.team.deleteMany({
      where: { departmentId: departmentId },
    });

    // Finally, delete the department itself
    await tx.department.delete({
      where: { id: departmentId },
    });

    return { success: true };
  });
}

/**
 * Adds a member to a department.
 */
export async function addDepartmentMember(
  departmentId: string,
  userId: string,
  role: MembershipRole
) {
  return await prisma.departmentMember.create({
    data: {
      departmentId,
      userId,
      role,
    },
  });
}

/**
 * Removes a member from a department.
 */
export async function removeDepartmentMember(departmentId: string, userId: string) {
  return await prisma.departmentMember.delete({
    where: {
      userId_departmentId: {
        departmentId,
        userId,
      },
    },
  });
}

/**
 * Updates a member's role within a department.
 */
export async function updateDepartmentMemberRole(
  departmentId: string,
  userId: string,
  role: MembershipRole
) {
  return await prisma.departmentMember.update({
    where: {
      userId_departmentId: {
        departmentId,
        userId,
      },
    },
    data: { role },
  });
}
