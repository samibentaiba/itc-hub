// src/app/api/admin/teams/[teamId]/members/route.ts
import { NextRequest, NextResponse } from "next/server";
import { isAdmin, getAuthenticatedUser } from "@/lib/auth-helpers";
import * as TeamService from "@/server/admin/teams";
import { MembershipRole } from "@prisma/client";

interface RouteContext {
  params: {
    teamId: string;
  };
}

export async function POST(req: NextRequest, { params }: RouteContext) {
  const user = await getAuthenticatedUser();
  if (!user || !(await isAdmin(user.user.id))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { userId, role } = body;

    if (!userId || !role || !Object.values(MembershipRole).includes(role)) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const newMember = await TeamService.addTeamMember(params.teamId, userId, role);
    return NextResponse.json(newMember, { status: 201 });
  } catch (error) {
    console.error(`Admin Add Team Member POST Error (Team ID: ${params.teamId}):`, error);
    return NextResponse.json({ error: "Failed to add member to team" }, { status: 500 });
  }
}
