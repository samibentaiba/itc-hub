// src/app/api/admin/vlogs/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const params = await context.params;
    
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const vlog = await prisma.vlog.update({
      where: { id: params.id },
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        image: data.image,
        gallery: data.gallery,
        content: data.content,
        status: data.status,
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
    });

    return NextResponse.json(vlog);
  } catch (error) {
    console.error("Error updating vlog:", error);
    return NextResponse.json(
      { error: "Failed to update vlog" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const params = await context.params;
    
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.vlog.delete({
      where: { id: params.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting vlog:", error);
    return NextResponse.json(
      { error: "Failed to delete vlog" },
      { status: 500 }
    );
  }
}