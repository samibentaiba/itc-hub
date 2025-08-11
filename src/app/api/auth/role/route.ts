import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Make sure this path is correct

/**
 * API route to get the current user's role directly from the database.
 * This ensures the role is always up-to-date.
 *
 * @returns A JSON response containing the user's role, e.g., { "role": "ADMIN" }.
 * Returns a 401 error if the user is not authenticated or 404 if not found.
 */
export async function GET() {
  try {
    // Retrieve the session to identify the user
    const session = await getServerSession(authOptions);

    // If there's no session or user ID, the request is from an unauthenticated user.
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not Authenticated" }, { status: 401 });
    }

    // Fetch the user from the database using the ID from the session
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        role: true, // Only select the role field for efficiency
      },
    });

    // If no user is found in the database with that ID
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return the user's role directly from the database
    return NextResponse.json({ role: user.role });

  } catch (error) {
    console.error("Error fetching user role:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
