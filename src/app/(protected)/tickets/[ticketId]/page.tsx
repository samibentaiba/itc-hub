import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import TicketClient from "./TicketClient";

type TicketPageProps = {
  params: {
    ticketId: string;
  };
};

export default async function TicketPage({ params }: TicketPageProps) {
  const session = await getServerSession(authOptions);
  if (!session) {
    notFound();
  }

  const ticket = await prisma.ticket.findUnique({
    where: { id: params.ticketId },
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
          files: true,
        },
        orderBy: {
          timestamp: "asc",
        },
      },
      files: true,
    },
  });

  if (!ticket) {
    notFound();
  }

  const isMember =
    ticket.department?.members.some((m) => m.userId === session.user.id) ||
    ticket.team?.members.some((m) => m.userId === session.user.id);

  const isAdmin = session.user.role === "ADMIN";

  if (!isAdmin && !isMember && ticket.createdById !== session.user.id) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">
          You are not authorized to view this ticket.
        </p>
      </div>
    );
  }

  const isDepartmentManager = ticket.department
    ? ticket.department.managers.some((manager) => manager.id === session.user.id)
    : false;

  const isTeamLeader = ticket.team
    ? ticket.team.leaders.some((leader) => leader.id === session.user.id)
    : false;

  const canEditStatus = isAdmin || isDepartmentManager || isTeamLeader;

  return <TicketClient ticket={ticket} user={session.user} canEditStatus={canEditStatus} />;
}