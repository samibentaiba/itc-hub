// src/app/api/admin/events/requests/route.ts
import { NextRequest, NextResponse } from "next/server";
import { isAdmin, getAuthenticatedUser } from "@/lib/auth-helpers";
import * as EventService from "@/server/admin/events";

export async function GET(req: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user || !isAdmin(user.user.id)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const pendingEvents = await EventService.listEvents("PENDING");
    return NextResponse.json({ events: pendingEvents });
  } catch (error) {
    console.error("Admin Event Requests GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch event requests" }, { status: 500 });
  }
}
