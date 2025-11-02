// src\app\api\teams\[teamId]\route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import {
  getAuthenticatedUser,
  canAccessTeam,
  canManageTeam,
} from "@/lib/auth-helpers";

// ✅ Fix: params must be a Promise
interface RouteContext {
  params: Promise<{
     teamId: string
  }>;
}
export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const params = await context.params
    const { teamId } = params;
    const session = await getAuthenticatedUser();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user can access this team
    if (!(await canAccessTeam(session.user.id, teamId))) {
      return NextResponse.json(
        { error: "Forbidden - You don't have access to this team" },
        { status: 403 }
      );
    }

    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        department: true,
        leaders: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            avatar: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
                avatar: true,
                status: true,
              },
            },
          },
        },
        tickets: {
          include: {
            assignee: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
            createdBy: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
            messages: {
              select: {
                id: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        events: {
          include: {
            attendees: {
              select: { name: true },
            },
            organizer: { select: { name: true } },
          },
          orderBy: { date: "desc" },
        },
      },
    });

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    // Transform the data to match frontend expectations
    const transformedTeam = {
      id: team.id,
      name: team.name,
      description: team.description || "",
      status: team.status || "active",
      department: team.department
        ? {
            id: team.department.id,
            name: team.department.name,
            description: team.department.description || "",
          }
        : null,
      leaders: team.leaders.map((leader) => ({
        id: leader.id,
        name: leader.name,
        email: leader.email,
        avatar: leader.avatar || "",
        role:
          leader.role.toLowerCase() === "admin"
            ? "admin"
            : leader.role.toLowerCase() === "manager"
            ? "manager"
            : "user",
      })),
      members: team.members.map((member) => ({
        id: member.user.id,
        name: member.user.name,
        email: member.user.email,
        avatar: member.user.avatar || "",
        role: member.role.toLowerCase() === "manager" ? "leader" : "member",
        status: member.user.status || "offline",
        joinedDate: member.joinedAt.toISOString(),
      })),
      tickets: team.tickets.map((ticket) => ({
        id: ticket.id,
        title: ticket.title,
        description: ticket.description || "",
        type: ticket.type.toLowerCase(),
        status: ticket.status.toLowerCase().replace("_", "_"),
        priority: ticket.priority.toLowerCase(),
        assignee: ticket.assignee?.name || null,
        createdBy: ticket.createdBy.name,
        dueDate:
          ticket.dueDate?.toISOString() ||
          new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        messages: ticket.messages.length,
        lastActivity: ticket.updatedAt.toLocaleDateString(),
        createdAt: ticket.createdAt.toISOString(),
        updatedAt: ticket.updatedAt.toISOString(),
      })),
      events: (team.events || []).map((event) => ({
        ...event,
        date: new Date(event.date).toISOString().split("T")[0],
        organizer: event.organizer?.name || "N/A",
        attendees: event.attendees.map((attendee) => attendee.name),
      })),
    };

    return NextResponse.json(transformedTeam);
  } catch (error) {
    console.error("Error fetching team:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

interface UpdateTeamBody {
  name?: string;
  description?: string;
  status?: string;
  departmentId?: string;
  memberIds?: string[];
}

export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  const params = await context.params
  try {
    const { teamId } =  params;
    const session = await getAuthenticatedUser();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user can manage this team
    if (!(await canManageTeam(session.user.id, teamId))) {
      return NextResponse.json(
        { error: "Forbidden - You don't have permission to manage this team" },
        { status: 403 }
      );
    }

    const body: UpdateTeamBody = await request.json();
    const { name, description, status, departmentId, memberIds } = body;

    const updateData: Prisma.TeamUpdateInput = {};

    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (status) updateData.status = status;
    if (departmentId) {
      updateData.department = {
        connect: { id: departmentId },
      };
    }

    const team = await prisma.team.update({
      where: { id: teamId },
      data: updateData,
      include: {
        department: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    // Handle member updates if provided
    if (memberIds !== undefined) {
      await prisma.teamMember.deleteMany({
        where: { teamId: teamId },
      });

      if (memberIds.length > 0) {
        await prisma.teamMember.createMany({
          data: memberIds.map((userId: string) => ({
            userId: userId,
            teamId: teamId,
            role: "MEMBER",
          })),
        });
      }
    }

    return NextResponse.json(team);
  } catch (error) {
    console.error("Error updating team:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const params = await context.params
    
    const { teamId } = params;
    const session = await getAuthenticatedUser();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user can manage this team
    if (!(await canManageTeam(session.user.id, teamId))) {
      return NextResponse.json(
        { error: "Forbidden - You don't have permission to delete this team" },
        { status: 403 }
      );
    }

    // Check if team exists
    const existingTeam = await prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!existingTeam) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    // Delete team and all related data
    await prisma.team.delete({
      where: { id: teamId },
    });

    return NextResponse.json({ message: "Team deleted successfully" });
  } catch (error) {
    console.error("Error deleting team:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
