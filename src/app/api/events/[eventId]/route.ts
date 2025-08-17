import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"

type RouteParams = Promise<{ eventId: string }>

export async function GET(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { eventId } = await params

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        department: {
          select: {
            id: true,
            name: true,
            color: true
          }
        },
        attendees: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      }
    })

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    return NextResponse.json(event)
  } catch (error) {
    console.error("Error fetching event:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

interface UpdateEventBody {
  title?: string;
  description?: string;
  date?: string;
  time?: string;
  duration?: number;
  type?: string;
  location?: string;
  attendees?: { id: string }[];
  isRecurring?: boolean;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { eventId } = await params
    const body: UpdateEventBody = await request.json()
    const { title, description, date, time, duration, type, location, attendees, isRecurring } = body

    // Check if event exists
    const existingEvent = await prisma.event.findUnique({
      where: { id: eventId }
    })

    if (!existingEvent) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    // Check permissions - only organizer or admins can update
    const canUpdate = 
      session.user.role === "ADMIN" ||
      session.user.role === "SUPERLEADER" ||
      existingEvent.organizerId === session.user.id

    if (!canUpdate) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const updateData: Prisma.EventUpdateInput = {}

    if (title) updateData.title = title
    if (description) updateData.description = description
    if (date) updateData.date = new Date(date)
    if (time !== undefined) updateData.time = time
    if (duration !== undefined) updateData.duration = duration
    if (type) updateData.type = type
    if (location !== undefined) updateData.location = location
    if (attendees !== undefined) {
      updateData.attendees = {
        set: attendees.map(attendee => ({ id: attendee.id }))
      }
    }
    if (isRecurring !== undefined) updateData.isRecurring = isRecurring

    const event = await prisma.event.update({
      where: { id: eventId },
      data: updateData,
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        department: {
          select: {
            id: true,
            name: true,
            color: true
          }
        },
        attendees: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      }
    })

    return NextResponse.json(event)
  } catch (error) {
    console.error("Error updating event:", error)
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

    const { eventId } = await params

    // Check if event exists
    const existingEvent = await prisma.event.findUnique({
      where: { id: eventId }
    })

    if (!existingEvent) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    // Check permissions - only organizer or admins can delete
    const canDelete = 
      session.user.role === "ADMIN" ||
      session.user.role === "SUPERLEADER" ||
      existingEvent.organizerId === session.user.id

    if (!canDelete) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Delete event
    await prisma.event.delete({
      where: { id: eventId }
    })

    return NextResponse.json({ message: "Event deleted successfully" })
  } catch (error) {
    console.error("Error deleting event:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}