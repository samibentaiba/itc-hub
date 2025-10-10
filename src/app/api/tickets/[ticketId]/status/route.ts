import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TicketStatus } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: { ticketId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { status } = await req.json();
    if (!status || !Object.values(TicketStatus).includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id: params.ticketId },
    });

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    if (ticket.createdById !== session.user.id) {
      return NextResponse.json(
        { error: "Only the ticket creator can change the status" },
        { status: 403 }
      );
    }

    const updatedTicket = await prisma.ticket.update({
      where: { id: params.ticketId },
      data: { status },
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

    return NextResponse.json(updatedTicket, { status: 200 });
  } catch (error) {
    console.error("Error updating ticket status:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}