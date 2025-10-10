import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { mkdir } from "fs/promises";

// TODO: Implement a more robust file upload solution, e.g., using a cloud storage provider.

export async function POST(
  req: NextRequest,
  { params }: { params: { ticketId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id: params.ticketId },
      include: {
        department: { include: { members: true } },
        team: { include: { members: true } },
      },
    });

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    const isMember =
      ticket.department?.members.some((m) => m.userId === session.user.id) ||
      ticket.team?.members.some((m) => m.userId === session.user.id);

    if (!isMember && ticket.createdById !== session.user.id) {
      return NextResponse.json(
        { error: "You are not authorized to upload files to this ticket" },
        { status: 403 }
      );
    }

    const data = await req.formData();
    const file: File | null = data.get('file') as unknown as File

    if (!file) {
      return NextResponse.json({ success: false })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    const path = join(uploadsDir, file.name)
    await writeFile(path, buffer)

    const dbFile = await prisma.file.create({
        data: {
            filename: file.name,
            mimetype: file.type,
            url: `/uploads/${file.name}`,
            ticketId: params.ticketId,
            uploadedById: session.user.id,
            data: buffer,
        }
    });

    return NextResponse.json({ success: true, file: dbFile }, { status: 201 });

  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}