
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: { ticketId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content } = await req.json();
    if (!content) {
      return NextResponse.json({ error: "Message content is required" }, { status: 400 });
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
        { error: "You are not authorized to comment on this ticket" },
        { status: 403 }
      );
    }

    const message = await prisma.message.create({
      data: {
        content,
        ticketId: params.ticketId,
        senderId: session.user.id,
        type: "TEXT",
      },
      include: {
        sender: true,
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("Error adding message:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
