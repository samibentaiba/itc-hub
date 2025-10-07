// src/app/api/admin/users/[userId]/verify/route.ts
import { NextRequest, NextResponse } from "next/server";
import { isAdmin, getAuthenticatedUser } from "@/lib/auth-helpers";
import * as UserService from "@/server/admin/users";

interface RouteContext {
  params: {
    userId: string;
  };
}

export async function POST(req: NextRequest, { params }: RouteContext) {
  const user = await getAuthenticatedUser();
  if (!user || !(await isAdmin(user.user.id))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const updatedUser = await UserService.verifyUser(params.userId);
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error(`Admin User Verify POST Error (User ID: ${params.userId}):`, error);
    return NextResponse.json({ error: "Failed to verify user" }, { status: 500 });
  }
}
