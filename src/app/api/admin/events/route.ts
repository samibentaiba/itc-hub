// src/app/api/admin/events/route.ts
import { NextRequest, NextResponse } from "next/server";
import { isAdmin, getAuthenticatedUser } from "@/lib/auth-helpers";
import * as EventService from "@/server/admin/events";

export async function GET(_req: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user || !(await isAdmin(user.user.id))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    // By default, GET returns confirmed events for the main calendar
    const events = await EventService.listEvents("CONFIRMED");
    return NextResponse.json({ events });
  } catch (error) {
    console.error("Admin Events GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user || !(await isAdmin(user.user.id))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const newEvent = await EventService.createEvent(body);
    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error("Admin Events POST Error:", error);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}
