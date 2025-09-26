// src/app/api/admin/departments/[departmentId]/members/route.ts
import { NextRequest, NextResponse } from "next/server";
import { isAdmin, getAuthenticatedUser } from "@/lib/auth-helpers";
import * as DepartmentService from "@/server/admin/departments";
import { MembershipRole } from "@prisma/client";

interface RouteContext {
  params: {
    departmentId: string;
  };
}

export async function POST(req: NextRequest, { params }: RouteContext) {
  const user = await getAuthenticatedUser();
  if (!user || !isAdmin(user.user.id)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { userId, role } = body;

    if (!userId || !role || !Object.values(MembershipRole).includes(role)) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const newMember = await DepartmentService.addDepartmentMember(params.departmentId, userId, role);
    return NextResponse.json(newMember, { status: 201 });
  } catch (error) {
    console.error(`Admin Add Dept Member POST Error (Dept ID: ${params.departmentId}):`, error);
    return NextResponse.json({ error: "Failed to add member to department" }, { status: 500 });
  }
}
