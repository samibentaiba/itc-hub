// src/app/api/admin/departments/route.ts
import { NextRequest, NextResponse } from "next/server";
import { isAdmin, getAuthenticatedUser } from "@/lib/auth-helpers";
import * as DepartmentService from "@/server/admin/departments";

export async function GET(req: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user || !isAdmin(user.user.id)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const departments = await DepartmentService.listDepartments();
    return NextResponse.json({ departments });
  } catch (error) {
    console.error("Admin Departments GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch departments" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user || !isAdmin(user.user.id)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const newDepartment = await DepartmentService.createDepartment(body);
    return NextResponse.json(newDepartment, { status: 201 });
  } catch (error) {
    console.error("Admin Departments POST Error:", error);
    return NextResponse.json({ error: "Failed to create department" }, { status: 500 });
  }
}
