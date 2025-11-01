// src/app/api/admin/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth-helpers";
import * as UserService from "@/server/admin/users";
import { getAuthenticatedUser } from "@/lib/auth-helpers";

export async function GET(_req: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user || !(await isAdmin(user.user.id))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const users = await UserService.listUsers();
    return NextResponse.json({ users });
  } catch (error) {
    console.error("Admin Users GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user || !(await isAdmin(user.user.id))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const newUser = await UserService.createUser(body);
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Admin Users POST Error:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
