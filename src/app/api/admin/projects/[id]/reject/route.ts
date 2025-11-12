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

    await prisma.project.update({
      where: { id: params.id },
      data: { status: "draft" },
    });

    // TODO: Send notification to author

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error rejecting project:", error);
    return NextResponse.json(
      { error: "Failed to reject project" },
      { status: 500 }
    );
  }
}
