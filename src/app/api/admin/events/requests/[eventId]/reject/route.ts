// src/app/api/admin/events/requests/[eventId]/reject/route.ts
import { NextRequest, NextResponse } from "next/server";
import { isAdmin, getAuthenticatedUser } from "@/lib/auth-helpers";
import * as EventService from "@/server/admin/events";

interface RouteContext {
  params: {
    eventId: string;
  };
}

export async function POST(_req: NextRequest, { params }: RouteContext) {
  const user = await getAuthenticatedUser();
  if (!user || !(await isAdmin(user.user.id))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    await EventService.rejectEvent(params.eventId);
    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    console.error(`Admin Reject Event POST Error (Event ID: ${params.eventId}):`, error);
    return NextResponse.json({ error: "Failed to reject event" }, { status: 500 });
  }
}
