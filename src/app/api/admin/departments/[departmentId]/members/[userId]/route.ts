// src/app/api/admin/departments/[departmentId]/members/[userId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { isAdmin, getAuthenticatedUser } from "@/lib/auth-helpers";
import * as DepartmentService from "@/server/admin/departments";
import { MembershipRole } from "@prisma/client";

// ✅ Fix: Changed to interface with params as Promise
interface RouteContext {
  params: Promise<{
    departmentId: string;
    userId: string;
  }>;
} 

export async function PUT(
  req: NextRequest,
  context: RouteContext
) {
  // ✅ Fix: Await params
  const params = await context.params;
  
  const user = await getAuthenticatedUser();
  if (!user || !(await isAdmin(user.user.id))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { role } = body;

    if (!role || !Object.values(MembershipRole).includes(role)) {
      return NextResponse.json({ error: "Invalid role specified" }, { status: 400 });
    }

    const updatedMember = await DepartmentService.updateDepartmentMemberRole(
      params.departmentId, 
      params.userId, 
      role
    );

    return NextResponse.json(updatedMember);
  } catch (error) {
    // ✅ Fix: Changed from template literal to regular function call
    console.error(
      `Admin Update Dept Member Role PUT Error (Dept ID: ${params.departmentId}, User ID: ${params.userId}):`,
      error
    );
    return NextResponse.json({ error: "Failed to update member role" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  context: RouteContext
) {
  // ✅ Fix: Await params
  const params = await context.params;
  
  const user = await getAuthenticatedUser();
  if (!user || !(await isAdmin(user.user.id))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    await DepartmentService.removeDepartmentMember(params.departmentId, params.userId);
    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    // ✅ Fix: Changed from template literal to regular function call
    console.error(
      `Admin Remove Dept Member DELETE Error (Dept ID: ${params.departmentId}, User ID: ${params.userId}):`,
      error
    );
    return NextResponse.json({ error: "Failed to remove member" }, { status: 500 });
  }
}