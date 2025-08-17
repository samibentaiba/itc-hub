import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// Mock data generators to match the expected ProfileDataLocal structure
function generateMockStats() {
  return {
    projectsCompleted: Math.floor(Math.random() * 50) + 10,
    teamsLed: Math.floor(Math.random() * 5) + 1,
    mentorshipHours: Math.floor(Math.random() * 100) + 20,
    contributions: Math.floor(Math.random() * 500) + 100
  }
}

function generateMockSkills() {
  const allSkills = [
    { name: "React", level: 90 },
    { name: "TypeScript", level: 85 },
    { name: "Next.js", level: 80 },
    { name: "Prisma", level: 75 },
    { name: "Node.js", level: 85 },
    { name: "JavaScript", level: 95 },
    { name: "Python", level: 70 },
    { name: "SQL", level: 80 }
  ]
  return allSkills.slice(0, Math.floor(Math.random() * 4) + 4)
}

function generateMockProjects() {
  const projects = [
    {
      id: "PROJ-001",
      name: "User Authentication System",
      role: "Lead Developer",
      team: "Frontend",
      priority: "High",
      progress: 85
    },
    {
      id: "PROJ-002", 
      name: "API Documentation",
      role: "Technical Writer",
      team: "Backend",
      priority: "Medium",
      progress: 60
    },
    {
      id: "PROJ-003",
      name: "Mobile App Redesign",
      role: "UI/UX Contributor",
      team: "Design",
      priority: "Low",
      progress: 30
    }
  ]
  return projects.slice(0, Math.floor(Math.random() * 2) + 2)
}

function generateMockAchievements() {
  return [
    {
      id: "ACH-001",
      title: "Innovation Award 2024",
      description: "Recognized for developing an innovative solution that improved team productivity by 40%",
      category: "Innovation",
      date: "2024-06-15"
    },
    {
      id: "ACH-002",
      title: "Team Leadership Excellence",
      description: "Successfully led a cross-functional team of 8 members to deliver a critical project on time",
      category: "Leadership", 
      date: "2024-03-10"
    },
    {
      id: "ACH-003",
      title: "Technical Excellence Recognition",
      description: "Outstanding contribution to the technical architecture and code quality standards",
      category: "Technical",
      date: "2024-01-20"
    }
  ]
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        profile: true,
        departments: {
          include: {
            department: true
          }
        },
        teams: {
          include: {
            team: {
              select: {
                id: true,
                name: true,
                _count: {
                  select: {
                    members: true
                  }
                }
              }
            }
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Transform teams data
    const teams = user.teams.map(teamMember => ({
      id: teamMember.team.id,
      name: teamMember.team.name,
      role: teamMember.role,
      members: teamMember.team._count.members,
      isLead: teamMember.role === 'MANAGER'
    }))

    // Transform departments data  
    const departments = user.departments.map(deptMember => ({
      id: deptMember.department.id,
      name: deptMember.department.name,
      role: deptMember.role
    }))

    // Build the complete profile data structure expected by the client
    const profileData = {
      profile: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&size=128`,
        role: user.role.toLowerCase() as 'admin' | 'manager' | 'user',
        title: user.role === 'ADMIN' ? 'System Administrator' : 
               user.role === 'MANAGER' ? 'Department Manager' : 'Software Developer',
        department: user.departments[0]?.department?.name || 'Engineering',
        location: 'San Francisco, CA',
        phone: '+1 (555) 123-4567',
        bio: user.profile?.bio || `Passionate ${user.role === 'ADMIN' ? 'system administrator' : 'developer'} with expertise in modern web technologies. Committed to building scalable solutions and mentoring team members.`,
        socialLinks: {
          github: 'https://github.com/example',
          linkedin: 'https://linkedin.com/in/example', 
          twitter: 'https://twitter.com/example',
          website: 'https://example.dev'
        }
      },
      stats: generateMockStats(),
      skills: generateMockSkills(),
      projects: generateMockProjects(),
      achievements: generateMockAchievements(),
      teams,
      departments
    }

    return NextResponse.json(profileData)
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, bio, socialLinks, title, location, phone } = body

    // Update user basic info
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name || undefined,
        profile: {
          upsert: {
            create: {
              bio: bio || "",
              realName: name || undefined
            },
            update: {
              bio: bio || undefined,
              realName: name || undefined
            }
          }
        }
      },
      include: {
        profile: true,
        departments: {
          include: {
            department: true
          }
        },
        teams: {
          include: {
            team: {
              select: {
                id: true,
                name: true,
                _count: {
                  select: {
                    members: true
                  }
                }
              }
            }
          }
        }
      }
    })

    // Return updated profile in the same format as GET
    const teams = updatedUser.teams.map(teamMember => ({
      id: teamMember.team.id,
      name: teamMember.team.name,
      role: teamMember.role,
      members: teamMember.team._count.members,
      isLead: teamMember.role === 'MANAGER'
    }))

    const departments = updatedUser.departments.map(deptMember => ({
      id: deptMember.department.id,
      name: deptMember.department.name,
      role: deptMember.role
    }))

    const profileData = {
      profile: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(updatedUser.name)}&background=random&size=128`,
        role: updatedUser.role.toLowerCase() as 'admin' | 'manager' | 'user',
        title: title || (updatedUser.role === 'ADMIN' ? 'System Administrator' : 
                        updatedUser.role === 'MANAGER' ? 'Department Manager' : 'Software Developer'),
        department: updatedUser.departments[0]?.department?.name || 'Engineering',
        location: location || 'San Francisco, CA',
        phone: phone || '+1 (555) 123-4567',
        bio: updatedUser.profile?.bio || 'No bio available',
        socialLinks: socialLinks || {
          github: 'https://github.com/example',
          linkedin: 'https://linkedin.com/in/example',
          twitter: 'https://twitter.com/example',
          website: 'https://example.dev'
        }
      },
      stats: generateMockStats(),
      skills: generateMockSkills(), 
      projects: generateMockProjects(),
      achievements: generateMockAchievements(),
      teams,
      departments
    }

    return NextResponse.json(profileData)
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}