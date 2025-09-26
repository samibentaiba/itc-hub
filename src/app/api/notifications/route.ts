// src\app\api\notifications\route.ts
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Prisma, NotificationType } from "@prisma/client"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const unread = searchParams.get("unread") || ""
    const type = searchParams.get("type") || ""

    const skip = (page - 1) * limit

    const where: Prisma.NotificationWhereInput = {
      userId: session.user.id
    }

    if (unread === "true") {
      where.unread = true
    }

    if (type && Object.values(NotificationType).includes(type as NotificationType)) {
      where.type = type as NotificationType
    }

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          time: "desc"
        }
      }),
      prisma.notification.count({ where })
    ])

    return NextResponse.json({
      notifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}


interface CreateNotificationBody {
  userId: string;
  title: string;
  description: string;
  type: "ASSIGNMENT" | "VERIFICATION" | "REMINDER" | "TEAM" | "GENERAL";
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body: CreateNotificationBody = await request.json()
    const { userId, title, description, type } = body

    if (!userId || !title || !description || !type) {
      return NextResponse.json(
        { error: "User ID, title, description, and type are required" },
        { status: 400 }
      )
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 400 }
      )
    }

    // Create notification
    const notification = await prisma.notification.create({
      data: {
        userId,
        title,
        description,
        type
      }
    })

    return NextResponse.json(notification, { status: 201 })
  } catch (error) {
    console.error("Error creating notification:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 