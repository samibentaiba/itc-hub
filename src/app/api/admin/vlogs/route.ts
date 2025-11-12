import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const vlogs = await prisma.vlog.findMany({
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

    return NextResponse.json({ vlogs });
  } catch (error) {
    console.error("Error fetching vlogs:", error);
    return NextResponse.json(
      { error: "Failed to fetch vlogs" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const {
      title,
      slug,
      description,
      image,
      gallery,
      content,
      status = "published",
    } = data;

    const vlog = await prisma.vlog.create({
      data: {
        title,
        slug,
        description,
        image,
        gallery,
        content,
        authorId: session.user.id,
        status,
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
    console.error("Error creating vlog:", error);
    return NextResponse.json(
      { error: "Failed to create vlog" },
      { status: 500 }
    );
  }
}
