import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import TicketClient from "./client";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function TicketDetailPage(props: {
  params: Promise<{ ticketId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    notFound();
  }
  const params = await props.params;
  const searchParams = await props.searchParams;
  const ticket = await prisma.ticket.findUnique({
    where: { id: params.ticketId },
    include: {
      createdBy: true,
      department: {
        include: {
          members: {
            select: {
              userId: true,
            },
          },
          managers: {
            select: {
              id: true,
            },
          },
        },
      },
      team: {
        include: {
          members: {
            select: {
              userId: true,
            },
          },
          leaders: {
            select: {
              id: true,
            },
          },
        },
      },
      messages: {
        include: {
          sender: true,
          files: {
            select: {
              id: true,
              filename: true,
              mimetype: true,
              url: true,
              uploadedAt: true,
            },
          },
        },
        orderBy: {
          timestamp: "asc",
        },
      },
      files: {
        select: {
          id: true,
          filename: true,
          mimetype: true,
          url: true,
          uploadedAt: true,
        },
      },
    },
  });
  const fromPath =
    typeof searchParams.from === "string" ? searchParams.from : "/tickets";
  if (!ticket) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          {/* Use the fromPath for the back button's href */}
          <Link href={fromPath}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <h3 className="text-lg font-semibold">Ticket not found</h3>
              <p className="text-muted-foreground">
                The ticket you&apos;re looking for doesn&apos;t exist.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isMember =
    ticket.department?.members.some((m) => m.userId === session.user.id) ||
    ticket.team?.members.some((m) => m.userId === session.user.id);

  const isAdmin = session.user.role === "ADMIN";

  if (!isAdmin && !isMember && ticket.createdById !== session.user.id) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          {/* Use the fromPath for the back button's href */}
          <Link href={fromPath}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <h3 className="text-lg font-semibold">Ticket found with no access</h3>
              <p className="text-muted-foreground">
                You do not have sufficient permissions to access this page
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isDepartmentManager = ticket.department
    ? ticket.department.managers.some(
        (manager) => manager.id === session.user.id
      )
    : false;

  const isTeamLeader = ticket.team
    ? ticket.team.leaders.some((leader) => leader.id === session.user.id)
    : false;

  const canEditStatus = isAdmin || isDepartmentManager || isTeamLeader;

  return (
    <TicketClient
      ticket={ticket}
      user={session.user}
      canEditStatus={canEditStatus}
      fromPath={fromPath} // Pass the path to the client component
    />
  );
}
