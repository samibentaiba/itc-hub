import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not Authenticated" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (!user) {
      // This is the part that was causing the 404 error.
      // We'll log it for debugging but return a 401 to be more accurate,
      // as the user is authenticated but not found in our system.
      console.error(`User with session ID ${session.user.id} not found in database.`);
      return NextResponse.json({ error: "User not found in prisma" }, { status: 404 });
    }

    return NextResponse.json({ role: user.role });

  } catch (error) {
    console.error("Role check error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
