// src/server/admin/users.ts
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { userFormSchema } from "@/app/(protected)/admin/types";
import { z } from "zod";

/**
 * Retrieves a list of all users.
 * The status is dynamically determined based on the `emailVerified` field.
 */
export async function listUsers() {
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return users.map((user) => ({
    ...user,
    status: user.emailVerified ? "verified" : "pending",
  }));
}

/**
 * Creates a new user.
 * @param data - The user data matching the form schema.
 */
export async function createUser(data: z.infer<typeof userFormSchema>) {
  const validatedData = userFormSchema.parse(data);

  const newUser = await prisma.user.create({
    data: {
      name: validatedData.name,
      email: validatedData.email,
      // FIXME: This is not a secure way to handle passwords.
      // In a real application, you should send an invitation email
      // with a link to set the password.
      password: "password-placeholder",
      emailVerified: new Date(),
    },
  });

  return {
    ...newUser,
    status: newUser.emailVerified ? "verified" : "pending",
  };
}

/**
 * Updates an existing user's information.
 * @param userId - The ID of the user to update.
 * @param data - The user data to update.
 */
export async function updateUser(
  userId: string,
  data: z.infer<typeof userFormSchema>
) {
  const validatedData = userFormSchema.parse(data);

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      name: validatedData.name,
      email: validatedData.email,
    },
  });

  return {
    ...updatedUser,
    status: updatedUser.emailVerified ? "verified" : "pending",
  };
}

/**
 * Deletes a user from the database.
 * @param userId - The ID of the user to delete.
 */
export async function deleteUser(userId: string) {
  await prisma.user.delete({
    where: { id: userId },
  });
  return { success: true };
}

/**
 * Verifies a user by setting their `emailVerified` timestamp.
 * @param userId - The ID of the user to verify.
 */
export async function verifyUser(userId: string) {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      emailVerified: new Date(),
    },
  });

  return {
    ...updatedUser,
    status: "verified",
  };
}