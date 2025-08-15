// src/lib/data-services.ts
// Direct database access for Server Components - no HTTP requests needed
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { canAccessTeam, canAccessDepartment, canManageTeam, canManageDepartment, canManageTicket } from "@/lib/auth-helpers"

// Helper to get authenticated user session
async function getAuthenticatedSession() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    throw new Error('Unauthorized - Please sign in')
  }
  return session
}

// Dashboard Data
export async function getDashboardData() {
  const session = await getAuthenticatedSession()
  
  // Get stats
  const [openTickets, closedTickets, totalUsers] = await Promise.all([
    prisma.ticket.count({ where: { status: 'OPEN' } }),
    prisma.ticket.count({ where: { status: 'CLOSED' } }),
    prisma.user.count()
  ])

  // Get recent tickets
  const recentTickets = await prisma.ticket.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      assignee: {
        select: { id: true, name: true, email: true, avatar: true }
      }
    }
  })

  // Get upcoming events (simplified for now)
  const upcomingEvents = await prisma.event.findMany({
    take: 5,
    where: {
      start: { gte: new Date() }
    },
    orderBy: { start: 'asc' }
  })

  return {
    stats: {
      openTickets,
      closedTickets,
      newUsers: totalUsers,
      pendingIssues: openTickets
    },
    recentTickets: recentTickets.map(ticket => ({
      id: ticket.id,
      title: ticket.title,
      status: ticket.status.toLowerCase(),
      priority: ticket.priority.toLowerCase(),
      assignee: ticket.assignee?.name || 'Unassigned',
      createdAt: ticket.createdAt.toISOString(),
      updatedAt: ticket.updatedAt.toISOString()
    })),
    upcomingEvents: upcomingEvents.map(event => ({
      id: event.id,
      title: event.title,
      start: event.start.toISOString(),
      end: event.end.toISOString(),
      type: event.type.toLowerCase()
    })),
    recentActivity: [] // Will be implemented if needed
  }
}

// Departments
export async function getDepartments() {
  const session = await getAuthenticatedSession()
  
  const departments = await prisma.department.findMany({
    include: {
      manager: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          role: true
        }
      },
      teams: {
        select: {
          id: true,
          name: true
        }
      },
      members: true,
      tickets: true
    }
  })

  return departments.map(dept => ({
    id: dept.id,
    name: dept.name,
    manager: dept.manager ? {
      id: dept.manager.id,
      name: dept.manager.name,
      email: dept.manager.email,
      avatar: dept.manager.avatar,
      role: dept.manager.role.toLowerCase()
    } : null,
    memberCount: dept.members.length,
    ticketCount: dept.tickets.length,
    teams: dept.teams,
    description: dept.description || ""
  }))
}

export async function getDepartmentById(departmentId: string) {
  const session = await getAuthenticatedSession()
  
  // Check access permissions
  if (!(await canAccessDepartment(session.user.id, departmentId))) {
    throw new Error('Forbidden - You don\'t have access to this department')
  }

  const department = await prisma.department.findUnique({
    where: { id: departmentId },
    include: {
      manager: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          role: true
        }
      },
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
              role: true,
              status: true
            }
          }
        }
      },
      teams: {
        include: {
          leader: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
              role: true
            }
          },
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  avatar: true,
                  role: true
                }
              }
            }
          }
        }
      },
      tickets: {
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
      }
    }
  })

  if (!department) {
    return null
  }

  // Transform to match frontend expectations
  return {
    id: department.id,
    name: department.name,
    manager: department.manager ? {
      id: department.manager.id,
      name: department.manager.name,
      email: department.manager.email,
      avatar: department.manager.avatar,
      role: department.manager.role.toLowerCase()
    } : null,
    memberCount: department.members.length,
    ticketCount: department.tickets.length,
    teams: department.teams.map(team => ({
      id: team.id,
      name: team.name,
      leader: team.leader ? {
        id: team.leader.id,
        name: team.leader.name,
        email: team.leader.email,
        avatar: team.leader.avatar,
        role: team.leader.role.toLowerCase()
      } : null,
      memberCount: team.members.length,
      members: team.members.map(member => ({
        id: member.user.id,
        name: member.user.name,
        email: member.user.email,
        avatar: member.user.avatar,
        role: member.user.role.toLowerCase()
      }))
    })),
    members: department.members.map(member => ({
      id: member.user.id,
      name: member.user.name,
      email: member.user.email,
      avatar: member.user.avatar,
      role: member.user.role.toLowerCase()
    })),
    tickets: department.tickets.map(ticket => ({
      id: ticket.id,
      title: ticket.title,
      status: ticket.status.toLowerCase(),
      priority: ticket.priority.toLowerCase(),
      assignee: ticket.assignee ? {
        id: ticket.assignee.id,
        name: ticket.assignee.name,
        email: ticket.assignee.email,
        avatar: ticket.assignee.avatar,
        role: ticket.assignee.role.toLowerCase()
      } : null,
      reporter: ticket.createdBy ? {
        id: ticket.createdBy.id,
        name: ticket.createdBy.name,
        email: ticket.createdBy.email,
        avatar: ticket.createdBy.avatar,
        role: ticket.createdBy.role.toLowerCase()
      } : null,
      createdAt: ticket.createdAt.toISOString(),
      updatedAt: ticket.updatedAt.toISOString()
    })),
    description: department.description || "",
    events: [] // Will be populated by events query if needed
  }
}

// Teams
export async function getTeams() {
  const session = await getAuthenticatedSession()
  
  const teams = await prisma.team.findMany({
    include: {
      leader: {
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
          name: true
        }
      },
      members: true,
      tickets: true
    }
  })

  return teams.map(team => ({
    id: team.id,
    name: team.name,
    leader: team.leader ? {
      id: team.leader.id,
      name: team.leader.name,
      email: team.leader.email,
      avatar: team.leader.avatar,
      role: team.leader.role.toLowerCase()
    } : null,
    department: team.department?.name || 'No Department',
    memberCount: team.members.length,
    members: team.members,
    description: team.description || ""
  }))
}

export async function getTeamById(teamId: string) {
  const session = await getAuthenticatedSession()
  
  // Check access permissions
  if (!(await canAccessTeam(session.user.id, teamId))) {
    throw new Error('Forbidden - You don\'t have access to this team')
  }

  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: {
      department: {
        select: {
          id: true,
          name: true,
          description: true
        }
      },
      leader: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          role: true
        }
      },
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
              role: true,
              status: true
            }
          }
        }
      },
      tickets: {
        include: {
          assignee: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true
            }
          }
        }
      }
    }
  })

  if (!team) {
    return null
  }

  return {
    id: team.id,
    name: team.name,
    leader: team.leader ? {
      id: team.leader.id,
      name: team.leader.name,
      email: team.leader.email,
      avatar: team.leader.avatar,
      role: team.leader.role.toLowerCase()
    } : null,
    department: team.department ? {
      id: team.department.id,
      name: team.department.name,
      description: team.department.description
    } : null,
    memberCount: team.members.length,
    members: team.members.map(member => ({
      id: member.user.id,
      name: member.user.name,
      email: member.user.email,
      avatar: member.user.avatar,
      role: member.user.role.toLowerCase(),
      status: member.user.status
    })),
    tickets: team.tickets.map(ticket => ({
      id: ticket.id,
      title: ticket.title,
      status: ticket.status.toLowerCase(),
      priority: ticket.priority.toLowerCase(),
      assignee: ticket.assignee?.name || 'Unassigned',
      dueDate: ticket.dueDate?.toISOString() || new Date().toISOString(),
      messages: 0, // Placeholder
      lastActivity: ticket.updatedAt.toISOString()
    })),
    description: team.description || ""
  }
}

// Tickets
export async function getTickets() {
  const session = await getAuthenticatedSession()
  
  const tickets = await prisma.ticket.findMany({
    include: {
      assignee: {
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
          name: true
        }
      },
      team: {
        select: {
          id: true,
          name: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  const stats = {
    open: tickets.filter(t => t.status === 'OPEN').length,
    inProgress: tickets.filter(t => t.status === 'IN_PROGRESS').length,
    closed: tickets.filter(t => t.status === 'CLOSED').length
  }

  return {
    tickets: tickets.map(ticket => ({
      id: ticket.id,
      title: ticket.title,
      status: ticket.status.toLowerCase(),
      priority: ticket.priority.toLowerCase(),
      assignee: ticket.assignee ? {
        id: ticket.assignee.id,
        name: ticket.assignee.name,
        email: ticket.assignee.email,
        avatar: ticket.assignee.avatar
      } : null,
      department: ticket.department ? {
        id: ticket.department.id,
        name: ticket.department.name
      } : null,
      team: ticket.team ? {
        id: ticket.team.id,
        name: ticket.team.name
      } : null,
      createdAt: ticket.createdAt.toISOString(),
      updatedAt: ticket.updatedAt.toISOString()
    })),
    stats
  }
}

export async function getTicketById(ticketId: string) {
  const session = await getAuthenticatedSession()

  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
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
          name: true
        }
      },
      team: {
        select: {
          id: true,
          name: true
        }
      },
      messages: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          }
        },
        orderBy: {
          createdAt: 'asc'
        }
      },
      files: {
        include: {
          uploadedBy: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          }
        }
      }
    }
  })

  if (!ticket) {
    return null
  }

  return {
    id: ticket.id,
    title: ticket.title,
    description: ticket.description,
    status: ticket.status.toLowerCase(),
    priority: ticket.priority.toLowerCase(),
    assignee: ticket.assignee ? {
      id: ticket.assignee.id,
      name: ticket.assignee.name,
      email: ticket.assignee.email,
      avatar: ticket.assignee.avatar,
      role: ticket.assignee.role.toLowerCase()
    } : null,
    reporter: ticket.createdBy ? {
      id: ticket.createdBy.id,
      name: ticket.createdBy.name,
      email: ticket.createdBy.email,
      avatar: ticket.createdBy.avatar,
      role: ticket.createdBy.role.toLowerCase()
    } : null,
    department: ticket.department ? {
      id: ticket.department.id,
      name: ticket.department.name
    } : null,
    team: ticket.team ? {
      id: ticket.team.id,
      name: ticket.team.name
    } : null,
    createdAt: ticket.createdAt.toISOString(),
    updatedAt: ticket.updatedAt.toISOString(),
    comments: ticket.messages.map(message => ({
      id: message.id,
      user: {
        id: message.user.id,
        name: message.user.name,
        avatar: message.user.avatar
      },
      comment: message.content,
      createdAt: message.createdAt.toISOString()
    })),
    attachments: ticket.files.map(file => ({
      id: file.id,
      name: file.filename,
      url: file.url,
      size: file.size,
      type: file.mimeType,
      uploadedAt: file.createdAt.toISOString(),
      uploadedBy: {
        id: file.uploadedBy.id,
        name: file.uploadedBy.name,
        avatar: file.uploadedBy.avatar
      }
    }))
  }
}

// Users
export async function getUsers() {
  const session = await getAuthenticatedSession()
  
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      role: true,
      status: true,
      createdAt: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return users.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    role: user.role.toLowerCase(),
    status: user.status || 'active'
  }))
}

export async function getUserById(userId: string) {
  const session = await getAuthenticatedSession()

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
      assignedTickets: {
        include: {
          department: {
            select: { id: true, name: true }
          },
          team: {
            select: { id: true, name: true }
          }
        }
      },
      createdTickets: {
        include: {
          department: {
            select: { id: true, name: true }
          },
          team: {
            select: { id: true, name: true }
          }
        }
      }
    }
  })

  if (!user) {
    return null
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    role: user.role.toLowerCase(),
    team: '', // Will be populated from team membership if needed
    department: '', // Will be populated from department membership if needed
    profile: user.profile ? {
      id: user.profile.id,
      bio: user.profile.bio || '',
      skills: [], // Parse from profile if stored as JSON
      socialLinks: {
        linkedin: user.profile.linkedin || '',
        twitter: user.profile.twitter || '',
        github: user.profile.github || ''
      }
    } : {
      bio: '',
      skills: [],
      socialLinks: { linkedin: '', twitter: '', github: '' }
    },
    assignedTickets: user.assignedTickets.map(ticket => ({
      id: ticket.id,
      title: ticket.title,
      status: ticket.status.toLowerCase(),
      priority: ticket.priority.toLowerCase(),
      department: ticket.department?.name || '',
      team: ticket.team?.name || '',
      createdAt: ticket.createdAt.toISOString()
    })),
    reportedTickets: user.createdTickets.map(ticket => ({
      id: ticket.id,
      title: ticket.title,
      status: ticket.status.toLowerCase(),
      priority: ticket.priority.toLowerCase(),
      department: ticket.department?.name || '',
      team: ticket.team?.name || '',
      createdAt: ticket.createdAt.toISOString()
    })),
    activity: [] // Will be implemented if needed
  }
}

// Profile and Settings
export async function getProfileData() {
  const session = await getAuthenticatedSession()

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      profile: true
    }
  })

  if (!user) {
    throw new Error('User not found')
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    role: user.role.toLowerCase(),
    bio: user.profile?.bio || '',
    skills: [], // Parse from profile if stored as JSON
    socialLinks: {
      linkedin: user.profile?.linkedin || '',
      twitter: user.profile?.twitter || '',
      github: user.profile?.github || ''
    }
  }
}

export async function getSettingsData() {
  const session = await getAuthenticatedSession()

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      profile: true
    }
  })

  if (!user) {
    throw new Error('User not found')
  }

  return {
    profile: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      bio: user.profile?.bio || ''
    },
    notifications: {
      email: true,
      push: true,
      ticketUpdates: true,
      mentions: true
    },
    theme: 'system' as const
  }
}

// Calendar events
export async function getPersonalCalendarData() {
  const session = await getAuthenticatedSession()

  const events = await prisma.event.findMany({
    where: {
      OR: [
        { organizerId: session.user.id },
        { attendees: { some: { id: session.user.id } } }
      ]
    },
    include: {
      organizer: {
        select: {
          id: true,
          name: true,
          avatar: true
        }
      }
    },
    orderBy: {
      start: 'asc'
    }
  })

  return events.map(event => ({
    id: event.id,
    title: event.title,
    start: event.start.toISOString(),
    end: event.end.toISOString(),
    allDay: event.allDay,
    type: event.type.toLowerCase(),
    description: event.description || '',
    location: event.location || ''
  }))
}

export async function getGlobalCalendarData() {
  const session = await getAuthenticatedSession()

  const events = await prisma.event.findMany({
    include: {
      organizer: {
        select: {
          id: true,
          name: true,
          avatar: true
        }
      }
    },
    orderBy: {
      start: 'asc'
    }
  })

  return events.map(event => ({
    id: event.id,
    title: event.title,
    start: event.start.toISOString(),
    end: event.end.toISOString(),
    allDay: event.allDay,
    type: event.type.toLowerCase(),
    description: event.description || '',
    location: event.location || ''
  }))
}

// Auth role check
export async function getUserRole(): Promise<string | null> {
  try {
    const session = await getServerSession(authOptions)
    return session?.user?.role?.toLowerCase() || null
  } catch (error) {
    console.error("Failed to fetch user role:", error)
    return null
  }
}