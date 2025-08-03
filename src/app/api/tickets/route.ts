import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || ""
    const type = searchParams.get("type") || ""
    const assigneeId = searchParams.get("assigneeId") || ""
    const createdById = searchParams.get("createdById") || ""
    const teamId = searchParams.get("teamId") || ""
    const departmentId = searchParams.get("departmentId") || ""

    const skip = (page - 1) * limit

    const where: any = {}

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } }
      ]
    }

    if (status) {
      where.status = status
    }

    if (type) {
      where.type = type
    }

    if (assigneeId) {
      where.assigneeId = assigneeId
    }

    if (createdById) {
      where.createdById = createdById
    }

    if (teamId) {
      where.teamId = teamId
    }

    if (departmentId) {
      where.departmentId = departmentId
    }

    const [tickets, total] = await Promise.all([
      prisma.ticket.findMany({
        where,
        skip,
        take: limit,
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
            select: {
              id: true,
              content: true,
              timestamp: true,
              sender: {
                select: {
                  id: true,
                  name: true,
                  avatar: true
                }
              }
            },
            orderBy: {
              timestamp: "desc"
            },
            take: 1
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
          createdAt: "desc"
        }
      }),
      prisma.ticket.count({ where })
    ])

    return NextResponse.json({
      tickets,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error("Error fetching tickets:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, type, status, dueDate, assigneeId, teamId, departmentId } = body

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      )
    }

    // Verify assignee exists if provided
    if (assigneeId) {
      const assignee = await prisma.user.findUnique({
        where: { id: assigneeId }
      })
      if (!assignee) {
        return NextResponse.json(
          { error: "Assignee not found" },
          { status: 400 }
        )
      }
    }

    // Verify team exists if provided
    if (teamId) {
      const team = await prisma.team.findUnique({
        where: { id: teamId }
      })
      if (!team) {
        return NextResponse.json(
          { error: "Team not found" },
          { status: 400 }
        )
      }
    }

    // Verify department exists if provided
    if (departmentId) {
      const department = await prisma.department.findUnique({
        where: { id: departmentId }
      })
      if (!department) {
        return NextResponse.json(
          { error: "Department not found" },
          { status: 400 }
        )
      }
    }

    // Create ticket
    const ticket = await prisma.ticket.create({
      data: {
        title,
        description,
        type: type || "TASK",
        status: status || "OPEN",
        dueDate: dueDate ? new Date(dueDate) : null,
        assigneeId,
        teamId,
        departmentId,
        createdById: session.user.id
      },
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

    // Create notification for assignee if assigned
    if (assigneeId && assigneeId !== session.user.id) {
      await prisma.notification.create({
        data: {
          userId: assigneeId,
          title: "New Ticket Assigned",
          description: `You have been assigned to ticket: ${title}`,
          type: "ASSIGNMENT"
        }
      })
    }

    return NextResponse.json(ticket, { status: 201 })
  } catch (error) {
    console.error("Error creating ticket:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 