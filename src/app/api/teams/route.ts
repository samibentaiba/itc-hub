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

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || ""
    const departmentId = searchParams.get("departmentId") || ""

    const skip = (page - 1) * limit

    const where: any = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } }
      ]
    }

    if (status) {
      where.status = status
    }

    if (departmentId) {
      where.departmentId = departmentId
    }

    const [teams, total] = await Promise.all([
      prisma.team.findMany({
        where,
        skip,
        take: limit,
        include: {
          department: {
            select: {
              id: true,
              name: true,
              description: true
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
          tickets: {
            select: {
              id: true,
              title: true,
              status: true,
              createdAt: true
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        }
      }),
      prisma.team.count({ where })
    ])

    return NextResponse.json({
      teams,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error("Error fetching teams:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || !["ADMIN", "SUPERLEADER", "LEADER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, status, departmentId, memberIds } = body

    if (!name || !departmentId) {
      return NextResponse.json(
        { error: "Team name and department are required" },
        { status: 400 }
      )
    }

    // Check if team already exists
    const existingTeam = await prisma.team.findUnique({
      where: { name }
    })

    if (existingTeam) {
      return NextResponse.json(
        { error: "Team with this name already exists" },
        { status: 400 }
      )
    }

    // Verify department exists
    const department = await prisma.department.findUnique({
      where: { id: departmentId }
    })

    if (!department) {
      return NextResponse.json(
        { error: "Department not found" },
        { status: 400 }
      )
    }

    // Create team with members
    const team = await prisma.team.create({
      data: {
        name,
        description,
        status: status || "active",
        departmentId,
        ...(memberIds && memberIds.length > 0 && {
          members: {
            create: memberIds.map((userId: string) => ({
              userId: userId,
              role: "MEMBER"
            }))
          }
        })
      },
      include: {
        department: {
          select: {
            id: true,
            name: true,
            description: true
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

    return NextResponse.json(team, { status: 201 })
  } catch (error) {
    console.error("Error creating team:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 