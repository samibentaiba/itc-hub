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

    const pendingProjects = await prisma.project.findMany({
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

    // For pending projects, we need to add submittedBy, submittedById, submittedByType, submittedAt
    // This information is not directly in the Project model, so we'll mock it for now
    // In a real application, you would have a separate PendingProject model or a more complex approval workflow
    const transformedPendingProjects = pendingProjects.map((project) => ({
      ...project,
      submittedBy: project.author.name, // Assuming author is the submitter
      submittedById: project.author.id,
      submittedByType: "user" as const,
      submittedAt: project.createdAt.toISOString(),
    }));

    return NextResponse.json({ pendingProjects: transformedPendingProjects });
  } catch (error) {
    console.error("Error fetching pending projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch pending projects" },
      { status: 500 }
    );
  }
}
