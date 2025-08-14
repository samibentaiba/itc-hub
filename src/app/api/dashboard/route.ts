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

    // Get dashboard statistics
    const [
      openTickets,
      inProgressTickets,
      closedTickets,
      totalUsers,
      recentTickets,
      upcomingEvents,
      recentActivity
    ] = await Promise.all([
      prisma.ticket.count({ where: { status: 'OPEN' } }),
      prisma.ticket.count({ where: { status: 'IN_PROGRESS' } }),
      prisma.ticket.count({ where: { status: 'CLOSED' } }),
      prisma.user.count(),
      prisma.ticket.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          assignee: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
              role: true
            }
          },
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
              role: true
            }
          },
          department: {
            select: {
              id: true,
              name: true,
              description: true
            }
          },
          team: {
            select: {
              id: true,
              name: true,
              description: true
            }
          }
        }
      }),
      prisma.event.findMany({
        take: 5,
        where: {
          date: {
            gte: new Date()
          }
        },
        orderBy: { date: 'asc' },
        include: {
          organizer: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true
            }
          }
        }
      }),
      prisma.ticket.findMany({
        take: 5,
        orderBy: { updatedAt: 'desc' },
        include: {
          assignee: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
              role: true
            }
          },
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
              role: true
            }
          }
        }
      })
    ])

    // Transform data to match frontend expectations
    const dashboardData = {
      stats: {
        openTickets,
        closedTickets,
        newUsers: totalUsers, // Could be calculated differently if needed
        pendingIssues: inProgressTickets
      },
      recentTickets: recentTickets.map(ticket => ({
        id: ticket.id,
        title: ticket.title,
        description: ticket.description || "",
        status: ticket.status.toLowerCase(),
        priority: ticket.priority.toLowerCase(),
        assignee: ticket.assignee ? {
          id: ticket.assignee.id,
          name: ticket.assignee.name,
          email: ticket.assignee.email,
          avatar: ticket.assignee.avatar,
          role: ticket.assignee.role.toLowerCase() === 'admin' ? 'admin' : 
                ticket.assignee.role.toLowerCase() === 'manager' ? 'manager' : 'user'
        } : null,
        reporter: ticket.createdBy ? {
          id: ticket.createdBy.id,
          name: ticket.createdBy.name,
          email: ticket.createdBy.email,
          avatar: ticket.createdBy.avatar,
          role: ticket.createdBy.role.toLowerCase() === 'admin' ? 'admin' : 
                ticket.createdBy.role.toLowerCase() === 'manager' ? 'manager' : 'user'
        } : null,
        department: ticket.department ? {
          id: ticket.department.id,
          name: ticket.department.name,
          description: ticket.department.description || ""
        } : null,
        team: ticket.team ? {
          id: ticket.team.id,
          name: ticket.team.name,
          description: ticket.team.description || ""
        } : null,
        createdAt: ticket.createdAt.toISOString(),
        updatedAt: ticket.updatedAt.toISOString()
      })),
      upcomingEvents: upcomingEvents.map(event => ({
        id: event.id,
        title: event.title,
        start: event.date.toISOString(),
        end: new Date(event.date.getTime() + (event.duration || 60) * 60000).toISOString(),
        allDay: false,
        type: event.type || 'meeting',
        description: event.description || "",
        participants: event.organizer ? [{
          id: event.organizer.id,
          name: event.organizer.name,
          email: event.organizer.email,
          avatar: event.organizer.avatar
        }] : []
      })),
      recentActivity: recentActivity.map(ticket => ({
        id: `activity-${ticket.id}`,
        user: ticket.assignee || ticket.createdBy,
        action: ticket.status === 'CLOSED' ? 'closed' : 'updated',
        target: ticket.id,
        createdAt: ticket.updatedAt.toISOString()
      }))
    }

    return NextResponse.json(dashboardData)
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}