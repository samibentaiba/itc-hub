// src/app/api/admin/departments/[departmentId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { isAdmin, getAuthenticatedUser } from "@/lib/auth-helpers";
import * as DepartmentService from "@/server/admin/departments";

interface RouteContext {
  params: Promise<{
    departmentId: string;
  }>;
}

export async function PUT(req: NextRequest, context: RouteContext) {
  const user = await getAuthenticatedUser();
  const params = await context.params
  if (!user || !(await isAdmin(user.user.id))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const updatedDepartment = await DepartmentService.updateDepartment(params.departmentId, body);
    return NextResponse.json(updatedDepartment);
  } catch (error) {
    console.error(`Admin Department PUT Error (Dept ID: ${params.departmentId}):`, error);
    return NextResponse.json({ error: "Failed to update department" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, context: RouteContext) {
  const user = await getAuthenticatedUser();
  const params = await context.params
  if (!user || !(await isAdmin(user.user.id))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    await DepartmentService.deleteDepartment(params.departmentId);
    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    console.error(`Admin Department DELETE Error (Dept ID: ${params.departmentId}):`, error);
    return NextResponse.json({ error: "Failed to delete department" }, { status: 500 });
  }
}
