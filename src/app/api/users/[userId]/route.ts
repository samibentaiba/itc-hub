import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Await params before accessing properties
    const { userId } = await params

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        departments: {
          include: {
            department: true
          }
        },
        teams: {
          include: {
            team: true
          }
        },
        // Use correct field names from schema
        createdTickets: {
          select: {
            id: true,
            title: true,
            status: true,
            createdAt: true
          }
        },
        assignedTickets: {
          select: {
            id: true,
            title: true,
            status: true,
            createdAt: true
          }
        },
        profile: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Transform the data to match the expected frontend format
    const transformedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role.toLowerCase(),
      avatar: user.avatar || `/avatars/${user.name.toLowerCase().replace(' ', '')}.png`,
      status: user.status || 'verified',
      joinDate: user.createdAt.toISOString(),
      title: user.role === 'ADMIN' ? 'System Administrator' : 
             user.role === 'MANAGER' ? 'Department Manager' : 'Team Member',
      department: user.departments[0]?.department?.name || 'Unassigned',
      location: 'Remote', // Default location
      bio: user.profile?.bio || 'No bio available',
      socialLinks: {
        github: '',
        linkedin: '',
        twitter: ''
      },
      stats: {
        projectsCompleted: user.assignedTickets.filter(t => t.status === 'CLOSED').length,
        teamsLed: user.teams.filter(t => t.role === 'MANAGER').length,
        mentorshipHours: 0,
        contributions: user.createdTickets.length
      },
      skills: [
        { name: 'JavaScript', level: 85 },
        { name: 'React', level: 90 },
        { name: 'Node.js', level: 80 }
      ],
      currentProjects: user.assignedTickets
        .filter(t => t.status === 'IN_PROGRESS')
        .slice(0, 3)
        .map(ticket => ({
          id: ticket.id,
          name: ticket.title,
          role: 'Developer',
          team: user.teams[0]?.team?.name || 'General',
          priority: 'medium',
          progress: 50
        })),
      achievements: [
        {
          id: '1',
          title: 'Team Player',
          description: 'Outstanding collaboration and teamwork',
          category: 'Leadership',
          date: new Date().toISOString()
        }
      ],
      teams: user.teams.map(tm => ({
        id: tm.team.id,
        name: tm.team.name,
        role: tm.role.toLowerCase(),
        members: 5, // Default value
        isLead: tm.role === 'MANAGER'
      })),
      departments: user.departments.map(dm => ({
        id: dm.department.id,
        name: dm.department.name,
        role: dm.role.toLowerCase()
      }))
    }

    return NextResponse.json(transformedUser)
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Await params before accessing properties
    const { userId } = await params

    // Only allow users to update their own profile or admins to update any user
    if (session.user.id !== userId && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { name, email, role, avatar, status, password, departmentIds, teamIds } = body

    const updateData: any = {}

    if (name) updateData.name = name
    if (email) updateData.email = email
    if (role && session.user.role === "ADMIN") updateData.role = role
    if (avatar) updateData.avatar = avatar
    if (status && session.user.role === "ADMIN") updateData.status = status
    if (password) {
      updateData.password = await bcrypt.hash(password, 12)
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        status: true,
        updatedAt: true
      }
    })

    // Handle department and team memberships if provided
    if (departmentIds && session.user.role === "ADMIN") {
      await prisma.departmentMember.deleteMany({
        where: { userId: userId }
      })

      if (departmentIds.length > 0) {
        await prisma.departmentMember.createMany({
          data: departmentIds.map((deptId: string) => ({
            userId: userId,
            departmentId: deptId,
            role: "MEMBER"
          }))
        })
      }
    }

    if (teamIds && session.user.role === "ADMIN") {
      await prisma.teamMember.deleteMany({
        where: { userId: userId }
      })

      if (teamIds.length > 0) {
        await prisma.teamMember.createMany({
          data: teamIds.map((teamId: string) => ({
            userId: userId,
            teamId: teamId,
            role: "MEMBER"
          }))
        })
      }
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Await params before accessing properties
    const { userId } = await params

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Delete user and all related data
    await prisma.user.delete({
      where: { id: userId }
    })

    return NextResponse.json({ message: "User deleted successfully" })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}