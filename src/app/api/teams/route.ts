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

    const where: Prisma.TeamWhereInput = {}

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } }
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
          leader: {
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
      leader: team.leader ? {
        id: team.leader.id,
        name: team.leader.name,
        email: team.leader.email,
        avatar: team.leader.avatar,
        role: team.leader.role.toLowerCase() === 'admin' ? 'admin' : 
              team.leader.role.toLowerCase() === 'manager' ? 'manager' : 'user'
      } : null,
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

interface CreateTeamBody {
  name: string;
  description?: string;
  status?: string;
  departmentId: string;
  memberIds?: string[];
  leaderId?: string;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, leaderId, memberIds, departmentId } = body;

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
        leader: leaderId ? { connect: { id: leaderId } } : undefined,
        department: { connect: { id: departmentId } }, // ✅ required field
        members: {
          create: [
            ...(memberIds?.map((userId: string) => ({
              role: "MEMBER" as const,
              user: { connect: { id: userId } }
            })) ?? []),
            ...(leaderId
              ? [
                  {
                    role: "MANAGER" as const,
                    user: { connect: { id: leaderId } }
                  }
                ]
              : [])
          ]
        }
      },
      include: {
        leader: true,
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



