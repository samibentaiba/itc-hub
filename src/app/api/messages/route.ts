import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "50")
    const ticketId = searchParams.get("ticketId") || ""
    const senderId = searchParams.get("senderId") || ""

    if (!ticketId) {
      return NextResponse.json(
        { error: "Ticket ID is required" },
        { status: 400 }
      )
    }

    const skip = (page - 1) * limit

    const where: Prisma.MessageWhereInput = {
      ticketId: ticketId
    }

    if (senderId) {
      where.senderId = senderId
    }

    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where,
        skip,
        take: limit,
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
      }),
      prisma.message.count({ where })
    ])

    return NextResponse.json({
      messages,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

interface CreateMessageBody {
  ticketId: string;
  content: string;
  type?: string;
  reactions?: Prisma.JsonValue;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body: CreateMessageBody = await request.json()
    const { ticketId, content, type, reactions } = body

    if (!ticketId || !content) {
      return NextResponse.json(
        { error: "Ticket ID and content are required" },
        { status: 400 }
      )
    }

    // Verify ticket exists
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId }
    })

    if (!ticket) {
      return NextResponse.json(
        { error: "Ticket not found" },
        { status: 400 }
      )
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        ticketId,
        senderId: session.user.id,
        content,
        type: type || "text",
        reactions: reactions || null
      },
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
      }
    })

    // Create notification for ticket assignee if different from sender
    if (ticket.assigneeId && ticket.assigneeId !== session.user.id) {
      await prisma.notification.create({
        data: {
          userId: ticket.assigneeId,
          title: "New Message",
          description: `New message in ticket: ${ticket.title}`,
          type: "GENERAL"
        }
      })
    }

    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    console.error("Error creating message:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 