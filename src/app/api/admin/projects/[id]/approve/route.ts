import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const project = await prisma.project.update({
      where: { id: params.id },
      data: { status: "published" },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    // TODO: Send notification to author

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error approving project:", error);
    return NextResponse.json(
      { error: "Failed to approve project" },
      { status: 500 }
    );
  }
}
