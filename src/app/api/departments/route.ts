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

    let where: Prisma.DepartmentWhereInput = {}

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ]
    }

    if (status) {
      where.status = status
    }

    if (session.user.role !== "ADMIN") {
      const userAccessCondition: Prisma.DepartmentWhereInput = {
        OR: [
          { members: { some: { userId: session.user.id } } },
          { managers: { some: { id: session.user.id } } },
        ],
      }
      where = {
        AND: [where, userAccessCondition],
      }
    }

    const [departments, total] = await Promise.all([
      prisma.department.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          description: true,
          status: true,
          managers: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          teams: {
            select: {
              id: true,
              name: true,
              _count: {
                select: {
                  members: true,
                },
              },
            },
          },
          _count: {
            select: {
              members: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.department.count({ where }),
    ]);

    const transformedDepartments = departments.map((dept) => ({
      id: dept.id,
      name: dept.name,
      description: dept.description,
      managers: dept.managers,
      teamCount: dept.teams.length,
      memberCount: dept._count.members,
      status: dept.status,
      recentActivity: "No recent activity",
      teams: dept.teams.map((team) => ({
        name: team.name,
        memberCount: team._count.members,
      })),
    }));

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