import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getAuthenticatedUser, canAccessTeam, canManageTeam } from "@/lib/auth-helpers"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
) {
  try {
    const { teamId } = await params;
    const session = await getAuthenticatedUser()
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user can access this team
    if (!(await canAccessTeam(session.user.id, teamId))) {
      return NextResponse.json({ error: "Forbidden - You don't have access to this team" }, { status: 403 })
    }

    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        department: {
          select: {
            id: true,
            name: true,
            description: true
          }
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
                status: true
              }
            }
          }
        },
        tickets: {
          include: {
            assignee: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true
              }
            },
            createdBy: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true
              }
            }
          },
          orderBy: {
            createdAt: "desc"
          }
        }
      }
    })

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 })
    }

    return NextResponse.json(team)
  } catch (error) {
    console.error("Error fetching team:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
) {
  try {
    const { teamId } = await params;
    const session = await getAuthenticatedUser()
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user can manage this team
    if (!(await canManageTeam(session.user.id, teamId))) {
      return NextResponse.json({ error: "Forbidden - You don't have permission to manage this team" }, { status: 403 })
    }

    const body = await request.json()
    const { name, description, status, departmentId, memberIds } = body

    const updateData: any = {}

    if (name) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (status) updateData.status = status
    if (departmentId) updateData.departmentId = departmentId

    const team = await prisma.team.update({
      where: { id: teamId },
      data: updateData,
      include: {
        department: {
          select: {
            id: true,
            name: true,
            description: true
          }
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
                avatar: true
              }
            }
          }
        }
      }
    })

    // Handle member updates if provided
    if (memberIds !== undefined) {
      await prisma.teamMember.deleteMany({
        where: { teamId: teamId }
      })

      if (memberIds.length > 0) {
        await prisma.teamMember.createMany({
          data: memberIds.map((userId: string) => ({
            userId: userId,
            teamId: teamId,
            role: "MEMBER"
          }))
        })
      }
    }

    return NextResponse.json(team)
  } catch (error) {
    console.error("Error updating team:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
) {
  try {
    const { teamId } = await params;
    const session = await getAuthenticatedUser()
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user can manage this team
    if (!(await canManageTeam(session.user.id, teamId))) {
      return NextResponse.json({ error: "Forbidden - You don't have permission to delete this team" }, { status: 403 })
    }

    // Check if team exists
    const existingTeam = await prisma.team.findUnique({
      where: { id: teamId }
    })

    if (!existingTeam) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 })
    }

    // Delete team and all related data
    await prisma.team.delete({
      where: { id: teamId }
    })

    return NextResponse.json({ message: "Team deleted successfully" })
  } catch (error) {
    console.error("Error deleting team:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 