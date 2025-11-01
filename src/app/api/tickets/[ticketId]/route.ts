
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
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
        createdBy: true,
        department: {
          include: {
            members: true,
          },
        },
        team: {
          include: {
            members: true,
          },
        },
        messages: {
          include: {
            sender: true,
          },
          orderBy: {
            timestamp: "asc",
          },
        },
        files: true,
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
        { error: "You are not authorized to view this ticket" },
        { status: 403 }
      );
    }

    return NextResponse.json(ticket, { status: 200 });
  } catch (error) {
    console.error("Error getting ticket:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
