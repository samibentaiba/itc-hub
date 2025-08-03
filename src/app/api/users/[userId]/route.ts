import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: params.userId },
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
        ticketsCreated: {
          select: {
            id: true,
            title: true,
            status: true,
            createdAt: true
          }
        },
        ticketsAssigned: {
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

    return NextResponse.json(user)
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
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Only allow users to update their own profile or admins to update any user
    if (session.user.id !== params.userId && session.user.role !== "ADMIN") {
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
      where: { id: params.userId },
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
        where: { userId: params.userId }
      })

      if (departmentIds.length > 0) {
        await prisma.departmentMember.createMany({
          data: departmentIds.map((deptId: string) => ({
            userId: params.userId,
            departmentId: deptId,
            role: "MEMBER"
          }))
        })
      }
    }

    if (teamIds && session.user.role === "ADMIN") {
      await prisma.teamMember.deleteMany({
        where: { userId: params.userId }
      })

      if (teamIds.length > 0) {
        await prisma.teamMember.createMany({
          data: teamIds.map((teamId: string) => ({
            userId: params.userId,
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
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: params.userId }
    })

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Delete user and all related data
    await prisma.user.delete({
      where: { id: params.userId }
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