import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { fileId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const file = await prisma.file.findUnique({
      where: { id: params.fileId },
      include: {
        ticket: {
          include: {
            department: { include: { members: true } },
            team: { include: { members: true } },
          },
        },
      },
    });

    if (!file || !file.ticket) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const isMember =
      file.ticket.department?.members.some(
        (m) => m.userId === session.user.id
      ) || file.ticket.team?.members.some((m) => m.userId === session.user.id);

    if (
      !isMember &&
      file.ticket.createdById !== session.user.id &&
      session.user.role !== "ADMIN"
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return new Response(file.data as unknown as BodyInit, {
      headers: {
        "Content-Type": file.mimetype,
      },
    });
  } catch (error) {
    console.error("Error retrieving file:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
