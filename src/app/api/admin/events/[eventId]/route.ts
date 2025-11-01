// src/app/api/admin/events/[eventId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { isAdmin, getAuthenticatedUser } from "@/lib/auth-helpers";
import * as EventService from "@/server/admin/events";

interface RouteContext {
  params: {
    eventId: string;
  };
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  const user = await getAuthenticatedUser();
  if (!user || !(await isAdmin(user.user.id))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const updatedEvent = await EventService.updateEvent(params.eventId, body);
    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error(`Admin Event PUT Error (Event ID: ${params.eventId}):`, error);
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const user = await getAuthenticatedUser();
  if (!user || !(await isAdmin(user.user.id))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    await EventService.deleteEvent(params.eventId);
    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    console.error(`Admin Event DELETE Error (Event ID: ${params.eventId}):`, error);
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
  }
}
