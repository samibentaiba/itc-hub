import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

type RouteParams = Promise<{ fileId: string }>

export async function GET(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { fileId } = await params

    const file = await prisma.file.findUnique({
      where: { id: fileId },
      include: {
        uploadedBy: {
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
            title: true
          }
        },
        message: {
          select: {
            id: true,
            content: true
          }
        }
      }
    })

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    // Check if user has access to this file
    // For now, allow access if user is authenticated
    // You might want to add more specific permission checks

    return NextResponse.json({
      id: file.id,
      filename: file.filename,
      mimetype: file.mimetype,
      uploadedAt: file.uploadedAt,
      uploadedBy: file.uploadedBy,
      ticket: file.ticket,
      message: file.message
    })
  } catch (error) {
    console.error("Error fetching file:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { fileId } = await params

    // Check if file exists
    const existingFile = await prisma.file.findUnique({
      where: { id: fileId },
      select: {
        id: true,
        uploadedById: true,
        ticket: {
          select: {
            id: true,
            createdById: true,
            assigneeId: true
          }
        }
      }
    })

    if (!existingFile) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    // Check permissions - only file uploader, ticket creator, assignee, or admins can delete
    const canDelete = 
      session.user.role === "ADMIN" ||
      existingFile.uploadedById === session.user.id ||
      existingFile.ticket?.createdById === session.user.id ||
      existingFile.ticket?.assigneeId === session.user.id

    if (!canDelete) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Delete file
    await prisma.file.delete({
      where: { id: fileId }
    })

    return NextResponse.json({ message: "File deleted successfully" })
  } catch (error) {
    console.error("Error deleting file:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// Download file endpoint
export async function PUT(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { fileId } = await params

    const file = await prisma.file.findUnique({
      where: { id: fileId }
    })

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    // Return file data for download
    return new NextResponse(file.data, {
      headers: {
        'Content-Type': file.mimetype,
        'Content-Disposition': `attachment; filename="${file.filename}"`
      }
    })
  } catch (error) {
    console.error("Error downloading file:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}