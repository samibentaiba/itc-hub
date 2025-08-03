import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: { departmentId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const department = await prisma.department.findUnique({
      where: { id: params.departmentId },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
                avatar: true,
                status: true
              }
            }
          }
        },
        teams: {
          include: {
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
          include: {
            assignee: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true
              }
            },
            createdBy: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true
              }
            }
          },
          orderBy: {
            createdAt: "desc"
          }
        }
      }
    })

    if (!department) {
      return NextResponse.json({ error: "Department not found" }, { status: 404 })
    }

    return NextResponse.json(department)
  } catch (error) {
    console.error("Error fetching department:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { departmentId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || !["ADMIN", "SUPERLEADER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, status, memberIds } = body

    const updateData: any = {}

    if (name) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (status) updateData.status = status

    const department = await prisma.department.update({
      where: { id: params.departmentId },
      data: updateData,
      include: {
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

    // Handle member updates if provided
    if (memberIds !== undefined) {
      await prisma.departmentMember.deleteMany({
        where: { departmentId: params.departmentId }
      })

      if (memberIds.length > 0) {
        await prisma.departmentMember.createMany({
          data: memberIds.map((userId: string) => ({
            userId: userId,
            departmentId: params.departmentId,
            role: "MEMBER"
          }))
        })
      }
    }

    return NextResponse.json(department)
  } catch (error) {
    console.error("Error updating department:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { departmentId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if department exists
    const existingDepartment = await prisma.department.findUnique({
      where: { id: params.departmentId }
    })

    if (!existingDepartment) {
      return NextResponse.json({ error: "Department not found" }, { status: 404 })
    }

    // Delete department and all related data
    await prisma.department.delete({
      where: { id: params.departmentId }
    })

    return NextResponse.json({ message: "Department deleted successfully" })
  } catch (error) {
    console.error("Error deleting department:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 