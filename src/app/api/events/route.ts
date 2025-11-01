import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { EventType, Prisma } from "@prisma/client"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "50") // Increased default limit
    const search = searchParams.get("search") || ""
    const typeFilter = searchParams.get("type") || ""
    const organizerId = searchParams.get("organizerId") || ""
    const startDate = searchParams.get("startDate") || ""
    const endDate = searchParams.get("endDate") || ""

    const skip = (page - 1) * limit

    const where: Prisma.EventWhereInput = {}

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } }
      ]
    }

    // Handle different type filters
    if (typeFilter === "personal") {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
          departments: { include: { department: true } },
          teams: { include: { team: { include: { department: true } } } },
        },
      });

      const departmentIds = new Set<string>();
      const teamIds = new Set<string>();

      user?.departments.forEach(dm => departmentIds.add(dm.departmentId));
      user?.teams.forEach(tm => {
        teamIds.add(tm.teamId);
        if (tm.team.departmentId) {
          departmentIds.add(tm.team.departmentId);
        }
      });

      where.OR = [
        { organizerId: session.user.id },
        { attendees: { some: { id: session.user.id } } },
        { departmentId: { in: Array.from(departmentIds) } },
        { teamId: { in: Array.from(teamIds) } },
      ];
    } else if (typeFilter === "global") {
      // For global calendar, show all events (company-wide view)
      // No additional filtering needed - show all events
    } else if (typeFilter && typeFilter !== "all") {
      // For specific event types
      where.type = typeFilter as EventType
    }

    if (organizerId) {
      where.organizerId = organizerId
    }

    if (startDate || endDate) {
      where.date = {}
      if (startDate) {
        where.date.gte = new Date(startDate)
      }
      if (endDate) {
        where.date.lte = new Date(endDate)
      }
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        skip,
        take: limit,
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
          team: {
            select: {
              id: true,
              name: true
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
        },
        orderBy: {
          date: "asc"
        }
      }),
      prisma.event.count({ where })
    ])

    // Transform events for the frontend
    const transformedEvents = events.map(event => ({
      id: event.id,
      title: event.title,
      description: event.description,
      start: event.date.toISOString(),
      date: event.date,
      time: event.time || "09:00",
      duration: event.duration || 60,
      type: event.type as EventType || "meeting",
      location: event.location || "TBD",
      organizer: event.organizer,
      department: event.department,
      participants: event.attendees,
      attendees: event.attendees,
      isRecurring: event.isRecurring || false,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt
    }))

    return NextResponse.json({
      events: transformedEvents,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

interface CreateEventBody {
  title: string;
  description?: string;
  date: string;
  time?: string;
  duration?: number;
  type?: string;
  location?: string;
  isRecurring?: boolean;
  departmentId?: string;
  teamId?: string;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body: CreateEventBody = await request.json()
    const { title, description, date, time, duration, type, location, isRecurring, departmentId } = body

    if (!title || !date) {
      return NextResponse.json(
        { error: "Title and date are required" },
        { status: 400 }
      )
    }

    // Create event
    const event = await prisma.event.create({
      data: {
        title,
        description: description || "",
        date: new Date(date),
        time: time || "09:00",
        duration: duration || 60,
        type: (type as EventType) || "meeting",
        location: location || "TBD",
        isRecurring: isRecurring || false,
        organizerId: session.user.id,
        departmentId: departmentId || null,
        status: "PENDING"
      },
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

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error("Error creating event:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}