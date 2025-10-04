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
    const limit = parseInt(searchParams.get("limit") || "100")
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || ""

    const skip = (page - 1) * limit

    const where: Prisma.DepartmentWhereInput = {}

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } }
      ]
    }

    if (status) {
      where.status = status
    }

    const [departments, total] = await Promise.all([
      prisma.department.findMany({
        where,
        skip,
        take: limit,
        include: {
          managers: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              avatar: true
            }
          },
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  role: true,
                  avatar: true
                }
              }
            }
          },
          teams: {
            include: {
              leaders: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  role: true,
                  avatar: true
                }
              },
              members: {
                include: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                      email: true,
                      role: true,
                      avatar: true
                    }
                  }
                }
              }
            }
          },
          tickets: {
            select: {
              id: true,
              title: true,
              status: true,
              priority: true,
              createdAt: true
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        }
      }),
      prisma.department.count({ where })
    ])

    // Transform departments to match frontend expectations
    const transformedDepartments = departments.map(dept => ({
      id: dept.id,
      name: dept.name,
      managers: dept.managers.map(manager => ({
        id: manager.id,
        name: manager.name,
        email: manager.email,
        avatar: manager.avatar,
        role: manager.role.toLowerCase() === 'admin' ? 'admin' : 
              manager.role.toLowerCase() === 'manager' ? 'manager' : 'user'
      })),
      memberCount: dept.members.length,
      ticketCount: dept.tickets.length,
      teams: dept.teams.map(team => ({
        id: team.id,
        name: team.name,
        leaders: team.leaders.map(leader => ({
          id: leader.id,
          name: leader.name,
          email: leader.email,
          avatar: leader.avatar,
          role: leader.role.toLowerCase() === 'admin' ? 'admin' : 
                leader.role.toLowerCase() === 'manager' ? 'manager' : 'user'
        })),
        memberCount: team.members.length,
        members: team.members.map(member => ({
          id: member.user.id,
          name: member.user.name,
          email: member.user.email,
          avatar: member.user.avatar,
          role: member.user.role.toLowerCase() === 'admin' ? 'admin' : 
                member.user.role.toLowerCase() === 'manager' ? 'manager' : 'user'
        }))
      })),
      members: dept.members.map(member => ({
        id: member.user.id,
        name: member.user.name,
        email: member.user.email,
        avatar: member.user.avatar,
        role: member.user.role.toLowerCase() === 'admin' ? 'admin' : 
              member.user.role.toLowerCase() === 'manager' ? 'manager' : 'user'
      })),
      description: dept.description || ""
    }))

    return NextResponse.json({
      departments: transformedDepartments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error("Error fetching departments:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, status, memberIds, managerIds } = body

    if (!name) {
      return NextResponse.json(
        { error: "Department name is required" },
        { status: 400 }
      )
    }

    // Check if department already exists
    const existingDepartment = await prisma.department.findUnique({
      where: { name }
    })

    if (existingDepartment) {
      return NextResponse.json(
        { error: "Department with this name already exists" },
        { status: 400 }
      )
    }

    // Create department with members
    const department = await prisma.department.create({
      data: {
        name,
        description,
        status: status || "active",
        managers: { connect: managerIds.map((id: string) => ({ id })) },
        ...(memberIds && memberIds.length > 0 && {
          members: {
            create: memberIds.map((userId: string) => ({
              userId: userId,
              role: "USER"
            }))
          }
        })
      },
      include: {
        managers: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            avatar: true
          }
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
                avatar: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json(department, { status: 201 })
  } catch (error) {
    console.error("Error creating department:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 