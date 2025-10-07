// src/app/api/admin/users/[userId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { isAdmin, getAuthenticatedUser } from "@/lib/auth-helpers";
import * as UserService from "@/server/admin/users";

interface RouteContext {
  params: {
    userId: string;
  };
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  const user = await getAuthenticatedUser();
  if (!user || !(await isAdmin(user.user.id))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const updatedUser = await UserService.updateUser(params.userId, body);
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error(`Admin User PUT Error (User ID: ${params.userId}):`, error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  const user = await getAuthenticatedUser();
  if (!user || !(await isAdmin(user.user.id))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    await UserService.deleteUser(params.userId);
    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    console.error(`Admin User DELETE Error (User ID: ${params.userId}):`, error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
