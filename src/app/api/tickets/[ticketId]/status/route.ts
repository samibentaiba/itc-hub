
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { TicketStatus } from "@prisma/client";

export async function PATCH(
  req: Request,
  { params }: { params: { ticketId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { ticketId } = params;
  const { status } = (await req.json()) as { status: TicketStatus };

  if (!Object.values(TicketStatus).includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    include: {
      department: { include: { managers: true } },
      team: { include: { leaders: true } },
    },
  });

  if (!ticket) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  const isAdmin = session.user.role === "ADMIN";
  const isDepartmentManager =
    ticket.department?.managers.some(
      (manager) => manager.id === session.user.id
    ) || false;
  const isTeamLeader =
    ticket.team?.leaders.some((leader) => leader.id === session.user.id) ||
    false;

  if (!isAdmin && !isDepartmentManager && !isTeamLeader) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const updatedTicket = await prisma.ticket.update({
    where: { id: ticketId },
    data: { status },
    include: {
      createdBy: true,
      department: {
        include: {
          members: true,
          managers: true,
        },
      },
      team: {
        include: {
          members: true,
          leaders: true,
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

  return NextResponse.json(updatedTicket);
}
