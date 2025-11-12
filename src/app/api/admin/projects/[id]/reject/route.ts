// src/app/api/admin/projects/[id]/reject/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function POST(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const params = await context.params;
    
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