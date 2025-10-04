
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { departmentId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const department = await prisma.department.findUnique({
      where: { id: params.departmentId },
      include: {
        managers: true,
        members: { include: { user: true } },
        teams: { include: { members: true, leaders: true } },
        tickets: { include: { assignee: true, createdBy: true } },
        events: { include: { attendees: true, organizer: true } },
      },
    });

    if (!department) {
      return NextResponse.json({ error: "Department not found" }, { status: 404 });
    }

    const transformedDepartment = {
      ...department,
      members: department.members.map(member => ({
        id: member.user.id,
        name: member.user.name,
        avatar: member.user.avatar,
        role: member.role,
      })),
    };

    return NextResponse.json(transformedDepartment);
  } catch (error) {
    console.error(`Error fetching department ${params.departmentId}:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { departmentId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.department.delete({
      where: { id: params.departmentId },
    });

    return NextResponse.json({ message: "Department deleted successfully" });
  } catch (error) {
    console.error(`Error deleting department ${params.departmentId}:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
