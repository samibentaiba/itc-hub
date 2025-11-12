import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const pendingVlogs = await prisma.vlog.findMany({
      where: {
        status: "pending",
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // For pending vlogs, we need to add submittedBy, submittedById, submittedByType, submittedAt
    // This information is not directly in the Vlog model, so we'll mock it for now
    // In a real application, you would have a separate PendingVlog model or a more complex approval workflow
    const transformedPendingVlogs = pendingVlogs.map((vlog) => ({
      ...vlog,
      submittedBy: vlog.author.name, // Assuming author is the submitter
      submittedById: vlog.author.id,
      submittedByType: "user" as const,
      submittedAt: vlog.createdAt.toISOString(),
    }));

    return NextResponse.json({ pendingVlogs: transformedPendingVlogs });
  } catch (error) {
    console.error("Error fetching pending vlogs:", error);
    return NextResponse.json(
      { error: "Failed to fetch pending vlogs" },
      { status: 500 }
    );
  }
}
