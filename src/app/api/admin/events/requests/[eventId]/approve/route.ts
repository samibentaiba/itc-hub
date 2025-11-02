// src/app/api/admin/events/requests/[eventId]/approve/route.ts
import { NextRequest, NextResponse } from "next/server";
import { isAdmin, getAuthenticatedUser } from "@/lib/auth-helpers";
import * as EventService from "@/server/admin/events";

interface RouteContext {
  params: Promise<{
    eventId: string;
  }>;
}

export async function POST(_req: NextRequest, context: RouteContext) {
  const user = await getAuthenticatedUser();
  const params = await context.params
  if (!user || !(await isAdmin(user.user.id))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const approvedEvent = await EventService.approveEvent(params.eventId);
    return NextResponse.json(approvedEvent);
  } catch (error) {
    console.error(`Admin Approve Event POST Error (Event ID: ${params.eventId}):`, error);
    return NextResponse.json({ error: "Failed to approve event" }, { status: 500 });
  }
}
