import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: { teamId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const team = await prisma.team.findUnique({
      where: { id: params.teamId },
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
  { params }: { params: { teamId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || !["ADMIN", "SUPERLEADER", "LEADER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, status, departmentId, memberIds } = body

    const updateData: any = {}

    if (name) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (status) updateData.status = status
    if (departmentId) updateData.departmentId = departmentId

    const team = await prisma.team.update({
      where: { id: params.teamId },
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
        where: { teamId: params.teamId }
      })

      if (memberIds.length > 0) {
        await prisma.teamMember.createMany({
          data: memberIds.map((userId: string) => ({
            userId: userId,
            teamId: params.teamId,
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
  { params }: { params: { teamId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || !["ADMIN", "SUPERLEADER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if team exists
    const existingTeam = await prisma.team.findUnique({
      where: { id: params.teamId }
    })

    if (!existingTeam) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 })
    }

    // Delete team and all related data
    await prisma.team.delete({
      where: { id: params.teamId }
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