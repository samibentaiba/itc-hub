// src/app/api/admin/departments/[departmentId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { isAdmin, getAuthenticatedUser } from "@/lib/auth-helpers";
import * as DepartmentService from "@/server/admin/departments";

interface RouteContext {
  params: {
    departmentId: string;
  };
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  const user = await getAuthenticatedUser();
  if (!user || !isAdmin(user.user.id)) {
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

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  const user = await getAuthenticatedUser();
  if (!user || !isAdmin(user.user.id)) {
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
