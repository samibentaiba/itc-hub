// src/app/api/admin/vlogs/[id]/approve/route.ts
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

    const vlog = await prisma.vlog.update({
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

    return NextResponse.json(vlog);
  } catch (error) {
    console.error("Error approving vlog:", error);
    return NextResponse.json(
      { error: "Failed to approve vlog" },
      { status: 500 }
    );
  }
}