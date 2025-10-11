// src/app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "";
    const departmentId = searchParams.get("departmentId") || "";
    const teamId = searchParams.get("teamId") || "";

    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
      ];
    }

    if (role) {
      where.role = role as Role;
    }

    if (departmentId) {
      where.departments = {
        some: {
          departmentId: departmentId,
        },
      };
    }

    if (teamId) {
      where.teams = {
        some: {
          teamId: teamId,
        },
      };
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatar: true,
          status: true,
          createdAt: true,
          departments: {
            include: {
              department: {
                select: {
                  id: true,
                  name: true,
                  description: true,
                },
              },
            },
          },
          teams: {
            include: {
              team: {
                select: {
                  id: true,
                  name: true,
                  description: true,
                },
              },
            },
          },
          assignedTickets: {
            select: { id: true, status: true },
          },
          createdTickets: {
            select: { id: true, status: true },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count({ where }),
    ]);

    const transformedUsers = users.map((user) => ({
      ...user,
      department: user.departments[0]?.department?.name || "Unassigned",
      teamCount: user.teams.length,
      ticketsAssigned: user.assignedTickets.length,
      ticketsCreated: user.createdTickets.length,
      completedTickets: user.assignedTickets.filter(
        (t) => t.status === "CLOSED"
      ).length,
      assignedTickets: undefined,
      createdTickets: undefined,
    }));

    return NextResponse.json({
      users: transformedUsers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

interface CreateUserBody {
  name: string;
  email: string;
  password?: string;
  role?: "ADMIN" | "MANAGER" | "USER";
  departmentIds?: string[];
  teamIds?: string[];
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: CreateUserBody = await request.json();
    const { name, email, password, role, departmentIds, teamIds } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "USER",
        status: "verified",
        emailVerified: new Date(),
        ...(departmentIds &&
          departmentIds.length > 0 && {
            departments: {
              create: departmentIds.map((deptId: string) => ({
                departmentId: deptId,
                role: "MEMBER",
              })),
            },
          }),
        ...(teamIds &&
          teamIds.length > 0 && {
            teams: {
              create: teamIds.map((teamId: string) => ({
                teamId: teamId,
                role: "MEMBER",
              })),
            },
          }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
