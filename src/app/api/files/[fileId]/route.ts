import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: { fileId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const file = await prisma.file.findUnique({
      where: { id: params.fileId },
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
      }
    })

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    // Return file data as blob
    const response = new NextResponse(file.data)
    response.headers.set("Content-Type", file.mimetype)
    response.headers.set("Content-Disposition", `attachment; filename="${file.filename}"`)
    
    return response
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
  { params }: { params: { fileId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if file exists
    const existingFile = await prisma.file.findUnique({
      where: { id: params.fileId }
    })

    if (!existingFile) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    // Check permissions - only uploader or admins can delete
    const canDelete = 
      session.user.role === "ADMIN" ||
      session.user.role === "SUPERLEADER" ||
      existingFile.uploadedById === session.user.id

    if (!canDelete) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Delete file
    await prisma.file.delete({
      where: { id: params.fileId }
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