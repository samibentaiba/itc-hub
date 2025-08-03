import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: { ticketId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id: params.ticketId },
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
        },
        team: {
          select: {
            id: true,
            name: true,
            description: true
          }
        },
        department: {
          select: {
            id: true,
            name: true,
            description: true
          }
        },
        messages: {
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true
              }
            },
            files: {
              select: {
                id: true,
                filename: true,
                mimetype: true,
                uploadedAt: true
              }
            }
          },
          orderBy: {
            timestamp: "asc"
          }
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
                email: true
              }
            }
          }
        },
        workingUsers: {
          select: {
            id: true,
            realName: true,
            bio: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true
              }
            }
          }
        }
      }
    })

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
    }

    return NextResponse.json(ticket)
  } catch (error) {
    console.error("Error fetching ticket:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { ticketId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, type, status, dueDate, assigneeId, teamId, departmentId } = body

    // Check if ticket exists
    const existingTicket = await prisma.ticket.findUnique({
      where: { id: params.ticketId }
    })

    if (!existingTicket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
    }

    // Check permissions - only creator, assignee, or admins can update
    const canUpdate = 
      session.user.role === "ADMIN" ||
      session.user.role === "SUPERLEADER" ||
      existingTicket.createdById === session.user.id ||
      existingTicket.assigneeId === session.user.id

    if (!canUpdate) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const updateData: any = {}

    if (title) updateData.title = title
    if (description) updateData.description = description
    if (type) updateData.type = type
    if (status) updateData.status = status
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null
    if (assigneeId !== undefined) updateData.assigneeId = assigneeId
    if (teamId !== undefined) updateData.teamId = teamId
    if (departmentId !== undefined) updateData.departmentId = departmentId

    const ticket = await prisma.ticket.update({
      where: { id: params.ticketId },
      data: updateData,
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
        },
        team: {
          select: {
            id: true,
            name: true,
            description: true
          }
        },
        department: {
          select: {
            id: true,
            name: true,
            description: true
          }
        }
      }
    })

    // Create notification for assignee if changed
    if (assigneeId && assigneeId !== existingTicket.assigneeId && assigneeId !== session.user.id) {
      await prisma.notification.create({
        data: {
          userId: assigneeId,
          title: "Ticket Assigned",
          description: `You have been assigned to ticket: ${ticket.title}`,
          type: "ASSIGNMENT"
        }
      })
    }

    return NextResponse.json(ticket)
  } catch (error) {
    console.error("Error updating ticket:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { ticketId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if ticket exists
    const existingTicket = await prisma.ticket.findUnique({
      where: { id: params.ticketId }
    })

    if (!existingTicket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
    }

    // Check permissions - only creator or admins can delete
    const canDelete = 
      session.user.role === "ADMIN" ||
      session.user.role === "SUPERLEADER" ||
      existingTicket.createdById === session.user.id

    if (!canDelete) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Delete ticket and all related data
    await prisma.ticket.delete({
      where: { id: params.ticketId }
    })

    return NextResponse.json({ message: "Ticket deleted successfully" })
  } catch (error) {
    console.error("Error deleting ticket:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 