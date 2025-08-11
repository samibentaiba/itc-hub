import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * Gets the current authenticated user's data directly from the database.
 * This ensures that the user's role and other properties are always up-to-date.
 *
 * @returns The full user object from the database, or null if not authenticated.
 */
export const currentUser = async () => {
  const session = await getServerSession(authOptions);

  // If there's no session or user ID, the user is not logged in.
  if (!session?.user?.id) {
    return null;
  }

  // Fetch the user from the database using the ID from the session.
  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  return user;
};
