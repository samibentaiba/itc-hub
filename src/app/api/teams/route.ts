// src\app\api\teams\route.ts
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
    const departmentId = searchParams.get("departmentId") || ""

    const skip = (page - 1) * limit

    let where: Prisma.TeamWhereInput = {}

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ]
    }

    if (status) {
      where.status = status
    }

    if (departmentId) {
      where.departmentId = departmentId
    }

    if (session.user.role !== "ADMIN") {
      const userAccessCondition: Prisma.TeamWhereInput = {
        OR: [
          { members: { some: { userId: session.user.id } } },
          { leaders: { some: { id: session.user.id } } },
        ],
      }
      where = {
        AND: [where, userAccessCondition],
      }
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
      prisma.team.count({ where })
    ])

    // Transform teams to match frontend expectations
    const transformedTeams = teams.map(team => ({
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
      department: team.department?.name || "",
      memberCount: team.members.length,
      members: team.members.map(member => ({
        id: member.user.id,
        name: member.user.name,
        email: member.user.email,
        avatar: member.user.avatar,
        role: member.user.role.toLowerCase() === 'admin' ? 'admin' : 
              member.user.role.toLowerCase() === 'manager' ? 'manager' : 'user'
      })),
      description: team.description || ""
    }))

    return NextResponse.json({
      teams: transformedTeams,
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


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, leaderIds, memberIds, departmentId } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    if (!departmentId) {
      return NextResponse.json({ error: "Department is required" }, { status: 400 });
    }

    const team = await prisma.team.create({
      data: {
        name,
        description,
        leaders: { connect: leaderIds.map((id: string) => ({ id })) },
        department: { connect: { id: departmentId } }, // ✅ required field
        members: {
          create: [
            ...(memberIds?.map((userId: string) => ({
              role: "MEMBER" as const,
              user: { connect: { id: userId } }
            })) ?? []),
            ...(leaderIds
              ? leaderIds.map((leaderId: string) => (
                  {
                    role: "MANAGER" as const,
                    user: { connect: { id: leaderId } }
                  }
                ))
              : [])
          ]
        }
      },
      include: {
        leaders: true,
        members: { include: { user: true } },
        department: true
      }
    });

    return NextResponse.json(team);
  } catch (error) {
    console.error("Error creating team:", error);
    return NextResponse.json({ error: "Failed to create team" }, { status: 500 });
  }
}



