// src/app/api/admin/teams/route.ts
import { NextRequest, NextResponse } from "next/server";
import { isAdmin, getAuthenticatedUser } from "@/lib/auth-helpers";
import * as TeamService from "@/server/admin/teams";

export async function GET(_req: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user || !(await isAdmin(user.user.id))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const teams = await TeamService.listTeams();
    return NextResponse.json({ teams });
  } catch (error) {
    console.error("Admin Teams GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch teams" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user || !(await isAdmin(user.user.id))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const newTeam = await TeamService.createTeam(body);
    return NextResponse.json(newTeam, { status: 201 });
  } catch (error) {
    console.error("Admin Teams POST Error:", error);
    return NextResponse.json({ error: "Failed to create team" }, { status: 500 });
  }
}
