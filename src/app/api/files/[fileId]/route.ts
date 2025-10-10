import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { readFileSync } from "fs";
import { join } from "path";

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
      file.ticket.department?.members.some((m) => m.userId === session.user.id) ||
      file.ticket.team?.members.some((m) => m.userId === session.user.id);

    if (!isMember && file.ticket.createdById !== session.user.id) {
      return NextResponse.json(
        { error: "You are not authorized to view this file" },
        { status: 403 }
      );
    }

    if (!file.url) {
        return NextResponse.json({ error: "File has no URL" }, { status: 404 });
    }

    const filePath = join(process.cwd(), 'public', file.url);
    const fileBuffer = readFileSync(filePath);

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": file.mimetype,
        "Content-Disposition": `attachment; filename="${file.filename}"`,
      },
    });

  } catch (error) {
    console.error("Error getting file:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}