// src\app\api\tickets\[ticketId]\route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, canManageTicket } from "@/lib/auth-helpers";
import { Prisma, TicketType, TicketStatus, TicketPriority } from "@prisma/client";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  try {
    const { ticketId } = await params;
    const session = await getAuthenticatedUser();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
          },
        },
        team: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        department: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        messages: {
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                role: true,
              },
            },
            files: {
              select: {
                id: true,
                filename: true,
                mimetype: true,
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
            uploadedAt: true,
            uploadedBy: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    // Transform ticket to match frontend expectations
    const transformedTicket = {
      id: ticket.id,
      title: ticket.title,
      description: ticket.description || "",
      status: ticket.status.toLowerCase(),
      priority: ticket.priority.toLowerCase(),
      type: ticket.type,
      assignee: ticket.assignee
        ? {
            id: ticket.assignee.id,
            name: ticket.assignee.name,
            email: ticket.assignee.email,
            avatar: ticket.assignee.avatar,
            role:
              ticket.assignee.role.toLowerCase() === "admin"
                ? "admin"
                : ticket.assignee.role.toLowerCase() === "manager"
                ? "manager"
                : "user",
          }
        : null,
      reporter: ticket.createdBy
        ? {
            id: ticket.createdBy.id,
            name: ticket.createdBy.name,
            email: ticket.createdBy.email,
            avatar: ticket.createdBy.avatar,
            role:
              ticket.createdBy.role.toLowerCase() === "admin"
                ? "admin"
                : ticket.createdBy.role.toLowerCase() === "manager"
                ? "manager"
                : "user",
          }
        : null,
      department: ticket.department
        ? {
            id: ticket.department.id,
            name: ticket.department.name,
            description: ticket.department.description || "",
          }
        : null,
      team: ticket.team
        ? {
            id: ticket.team.id,
            name: ticket.team.name,
            description: ticket.team.description || "",
          }
        : null,
      createdAt: ticket.createdAt.toISOString(),
      updatedAt: ticket.updatedAt.toISOString(),
      comments: ticket.messages.map((message) => ({
        id: message.id,
        user: {
          id: message.sender.id,
          name: message.sender.name,
          email: message.sender.email,
          avatar: message.sender.avatar,
          role:
            message.sender.role.toLowerCase() === "admin"
              ? "admin"
              : message.sender.role.toLowerCase() === "manager"
              ? "manager"
              : "user",
        },
        comment: message.content,
        createdAt: message.timestamp.toISOString(),
        reactions: message.reactions,
      })),
      attachments: ticket.files.map((file) => ({
        id: file.id,
        name: file.filename,
        url: `/api/files/${file.id}`,
        size: 0, // Would need to store this separately
        type: file.mimetype,
        uploadedAt: file.uploadedAt.toISOString(),
        uploadedBy: {
          id: file.uploadedBy.id,
          name: file.uploadedBy.name,
          email: file.uploadedBy.email,
        },
      })),
    };

    return NextResponse.json(transformedTicket);
  } catch (error) {
    console.error("Error fetching ticket:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

interface UpdateTicketBody {
  title?: string;
  description?: string;
  type?: TicketType;
  status?: TicketStatus;
  priority?: TicketPriority;
  dueDate?: string;
  assigneeId?: string;
  teamId?: string;
  departmentId?: string;
}


export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  try {
    const { ticketId } = await params;
    const session = await getAuthenticatedUser();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user can manage this ticket
    if (!(await canManageTicket(session.user.id, ticketId))) {
      return NextResponse.json(
        {
          error: "Forbidden - You don't have permission to update this ticket",
        },
        { status: 403 }
      );
    }

    const body: UpdateTicketBody = await request.json();
    const {
      title,
      description,
      type,
      status,
      priority,
      dueDate,
      assigneeId,
      teamId,
      departmentId,
    } = body;

    // Check if ticket exists
    const existingTicket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!existingTicket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }
const updateData: Prisma.TicketUpdateInput = {}

if (title) updateData.title = title
if (description) updateData.description = description
if (type) updateData.type = { set: type }
if (status) updateData.status = { set: status }
if (priority) updateData.priority = { set: priority }
if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null

if (assigneeId !== undefined) {
  updateData.assignee = assigneeId
    ? { connect: { id: assigneeId } }
    : { disconnect: true }
}

if (teamId !== undefined) {
  updateData.team = teamId
    ? { connect: { id: teamId } }
    : { disconnect: true }
}

if (departmentId !== undefined) {
  updateData.department = departmentId
    ? { connect: { id: departmentId } }
    : { disconnect: true }
}

  } catch (error) {
    console.error("Error updating ticket:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  try {
    const { ticketId } = await params;
    const session = await getAuthenticatedUser();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user can manage this ticket
    if (!(await canManageTicket(session.user.id, ticketId))) {
      return NextResponse.json(
        {
          error: "Forbidden - You don't have permission to delete this ticket",
        },
        { status: 403 }
      );
    }

    // Check if ticket exists
    const existingTicket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!existingTicket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    // Delete ticket and all related data
    await prisma.ticket.delete({
      where: { id: ticketId },
    });

    return NextResponse.json({ message: "Ticket deleted successfully" });
  } catch (error) {
    console.error("Error deleting ticket:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
