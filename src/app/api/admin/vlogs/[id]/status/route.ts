// src/app/api/admin/vlogs/[id]/status/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const params = await context.params;
    
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { status } = await request.json();

    const vlog = await prisma.vlog.update({
      where: { id: params.id },
      data: { status },
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

    return NextResponse.json(vlog);
  } catch (error) {
    console.error("Error updating vlog status:", error);
    return NextResponse.json(
      { error: "Failed to update vlog status" },
      { status: 500 }
    );
  }
}