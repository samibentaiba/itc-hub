import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: { messageId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const message = await prisma.message.findUnique({
      where: { id: params.messageId },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        ticket: {
          select: {
            id: true,
            title: true,
            status: true
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

    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 })
    }

    return NextResponse.json(message)
  } catch (error) {
    console.error("Error fetching message:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { messageId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { content, type, reactions } = body

    // Check if message exists
    const existingMessage = await prisma.message.findUnique({
      where: { id: params.messageId }
    })

    if (!existingMessage) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 })
    }

    // Check permissions - only sender can edit
    if (existingMessage.senderId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const updateData: any = {}

    if (content) updateData.content = content
    if (type) updateData.type = type
    if (reactions !== undefined) updateData.reactions = reactions
    updateData.edited = true

    const message = await prisma.message.update({
      where: { id: params.messageId },
      data: updateData,
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

    return NextResponse.json(message)
  } catch (error) {
    console.error("Error updating message:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { messageId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if message exists
    const existingMessage = await prisma.message.findUnique({
      where: { id: params.messageId }
    })

    if (!existingMessage) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 })
    }

    // Check permissions - only sender or admins can delete
    const canDelete = 
      session.user.role === "ADMIN" ||
      session.user.role === "SUPERLEADER" ||
      existingMessage.senderId === session.user.id

    if (!canDelete) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Delete message and all related data
    await prisma.message.delete({
      where: { id: params.messageId }
    })

    return NextResponse.json({ message: "Message deleted successfully" })
  } catch (error) {
    console.error("Error deleting message:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 