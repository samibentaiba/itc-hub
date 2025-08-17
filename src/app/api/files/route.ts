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
    const limit = parseInt(searchParams.get("limit") || "20")
    const ticketId = searchParams.get("ticketId") || ""
    const messageId = searchParams.get("messageId") || ""
    const uploadedById = searchParams.get("uploadedById") || ""

    const skip = (page - 1) * limit

    const where: Prisma.FileWhereInput = {}

    if (ticketId) {
      where.ticketId = ticketId
    }

    if (messageId) {
      where.messageId = messageId
    }

    if (uploadedById) {
      where.uploadedById = uploadedById
    }

    const [files, total] = await Promise.all([
      prisma.file.findMany({
        where,
        skip,
        take: limit,
        include: {
          uploadedBy: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          ticket: {
            select: {
              id: true,
              title: true
            }
          },
          message: {
            select: {
              id: true,
              content: true
            }
          }
        },
        orderBy: {
          uploadedAt: "desc"
        }
      }),
      prisma.file.count({ where })
    ])

    return NextResponse.json({
      files,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error("Error fetching files:", error)
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

    const formData = await request.formData()
    const file = formData.get("file") as File
    const ticketId = formData.get("ticketId") as string
    const messageId = formData.get("messageId") as string

    if (!file) {
      return NextResponse.json(
        { error: "File is required" },
        { status: 400 }
      )
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size exceeds 10MB limit" },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Verify ticket exists if provided
    if (ticketId) {
      const ticket = await prisma.ticket.findUnique({
        where: { id: ticketId }
      })
      if (!ticket) {
        return NextResponse.json(
          { error: "Ticket not found" },
          { status: 400 }
        )
      }
    }

    // Verify message exists if provided
    if (messageId) {
      const message = await prisma.message.findUnique({
        where: { id: messageId }
      })
      if (!message) {
        return NextResponse.json(
          { error: "Message not found" },
          { status: 400 }
        )
      }
    }

    // Create file record
    const fileRecord = await prisma.file.create({
      data: {
        filename: file.name,
        mimetype: file.type,
        data: buffer,
        uploadedById: session.user.id,
        ticketId: ticketId || null,
        messageId: messageId || null
      },
      include: {
        uploadedBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(fileRecord, { status: 201 })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 