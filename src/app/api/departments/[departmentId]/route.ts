import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: { departmentId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const department = await prisma.department.findUnique({
      where: { id: params.departmentId },
      include: {
        manager: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            avatar: true
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
        teams: {
          include: {
            leader: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
                avatar: true
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
        },
        tickets: {
          include: {
            assignee: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                role: true
              }
            },
            createdBy: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                role: true
              }
            }
          },
          orderBy: {
            createdAt: "desc"
          }
        }
      }
    })

    if (!department) {
      return NextResponse.json({ error: "Department not found" }, { status: 404 })
    }

    // Transform to match frontend expectations
    const transformedDepartment = {
      id: department.id,
      name: department.name,
      manager: department.manager ? {
        id: department.manager.id,
        name: department.manager.name,
        email: department.manager.email,
        avatar: department.manager.avatar,
        role: department.manager.role.toLowerCase() === 'admin' ? 'admin' : 
              department.manager.role.toLowerCase() === 'manager' ? 'manager' : 'user'
      } : null,
      memberCount: department.members.length,
      ticketCount: department.tickets.length,
      teams: department.teams.map(team => ({
        id: team.id,
        name: team.name,
        leader: team.leader ? {
          id: team.leader.id,
          name: team.leader.name,
          email: team.leader.email,
          avatar: team.leader.avatar,
          role: team.leader.role.toLowerCase() === 'admin' ? 'admin' : 
                team.leader.role.toLowerCase() === 'manager' ? 'manager' : 'user'
        } : null,
        memberCount: team.members.length,
        members: team.members.map(member => ({
          id: member.user.id,
          name: member.user.name,
          email: member.user.email,
          avatar: member.user.avatar,
          role: member.user.role.toLowerCase() === 'admin' ? 'admin' : 
                member.user.role.toLowerCase() === 'manager' ? 'manager' : 'user'
        }))
      })),
      members: department.members.map(member => ({
        id: member.user.id,
        name: member.user.name,
        email: member.user.email,
        avatar: member.user.avatar,
        role: member.user.role.toLowerCase() === 'admin' ? 'admin' : 
              member.user.role.toLowerCase() === 'manager' ? 'manager' : 'user'
      })),
      tickets: department.tickets.map(ticket => ({
        id: ticket.id,
        title: ticket.title,
        status: ticket.status.toLowerCase(),
        priority: ticket.priority.toLowerCase(),
        assignee: ticket.assignee ? {
          id: ticket.assignee.id,
          name: ticket.assignee.name,
          email: ticket.assignee.email,
          avatar: ticket.assignee.avatar,
          role: ticket.assignee.role.toLowerCase() === 'admin' ? 'admin' : 
                ticket.assignee.role.toLowerCase() === 'manager' ? 'manager' : 'user'
        } : null,
        reporter: ticket.createdBy ? {
          id: ticket.createdBy.id,
          name: ticket.createdBy.name,
          email: ticket.createdBy.email,
          avatar: ticket.createdBy.avatar,
          role: ticket.createdBy.role.toLowerCase() === 'admin' ? 'admin' : 
                ticket.createdBy.role.toLowerCase() === 'manager' ? 'manager' : 'user'
        } : null,
        createdAt: ticket.createdAt.toISOString(),
        updatedAt: ticket.updatedAt.toISOString()
      })),
      description: department.description || "",
      events: [] // Will be populated by events API if needed
    }

    return NextResponse.json(transformedDepartment)
  } catch (error) {
    console.error("Error fetching department:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { departmentId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, status, memberIds } = body

    const updateData: any = {}

    if (name) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (status) updateData.status = status

    const department = await prisma.department.update({
      where: { id: params.departmentId },
      data: updateData,
      include: {
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
      await prisma.departmentMember.deleteMany({
        where: { departmentId: params.departmentId }
      })

      if (memberIds.length > 0) {
        await prisma.departmentMember.createMany({
          data: memberIds.map((userId: string) => ({
            userId: userId,
            departmentId: params.departmentId,
            role: "USER"
          }))
        })
      }
    }

    return NextResponse.json(department)
  } catch (error) {
    console.error("Error updating department:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { departmentId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if department exists
    const existingDepartment = await prisma.department.findUnique({
      where: { id: params.departmentId }
    })

    if (!existingDepartment) {
      return NextResponse.json({ error: "Department not found" }, { status: 404 })
    }

    // Delete department and all related data
    await prisma.department.delete({
      where: { id: params.departmentId }
    })

    return NextResponse.json({ message: "Department deleted successfully" })
  } catch (error) {
    console.error("Error deleting department:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 