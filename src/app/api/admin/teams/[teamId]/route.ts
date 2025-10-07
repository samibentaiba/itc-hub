// src/app/api/admin/teams/[teamId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { isAdmin, getAuthenticatedUser } from "@/lib/auth-helpers";
import * as TeamService from "@/server/admin/teams";

interface RouteContext {
  params: {
    teamId: string;
  };
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  const user = await getAuthenticatedUser();
  if (!user || !(await isAdmin(user.user.id))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const updatedTeam = await TeamService.updateTeam(params.teamId, body);
    return NextResponse.json(updatedTeam);
  } catch (error) {
    console.error(`Admin Team PUT Error (Team ID: ${params.teamId}):`, error);
    return NextResponse.json({ error: "Failed to update team" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  const user = await getAuthenticatedUser();
  if (!user || !(await isAdmin(user.user.id))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    await TeamService.deleteTeam(params.teamId);
    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    console.error(`Admin Team DELETE Error (Team ID: ${params.teamId}):`, error);
    return NextResponse.json({ error: "Failed to delete team" }, { status: 500 });
  }
}
