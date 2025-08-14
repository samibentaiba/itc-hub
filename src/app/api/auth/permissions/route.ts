import { NextRequest, NextResponse } from "next/server"
import { getAuthenticatedUser, canAccessTeam, canAccessDepartment, canManageTeam, canManageDepartment, canManageTicket } from "@/lib/auth-helpers"

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthenticatedUser()
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const entityId = searchParams.get('entityId')

    if (!type || !entityId) {
      return NextResponse.json({ error: "Missing type or entityId parameter" }, { status: 400 })
    }

    let allowed = false;

    switch (type) {
      case 'team-access':
        allowed = await canAccessTeam(session.user.id, entityId);
        break;
      case 'team-manage':
        allowed = await canManageTeam(session.user.id, entityId);
        break;
      case 'department-access':
        allowed = await canAccessDepartment(session.user.id, entityId);
        break;
      case 'department-manage':
        allowed = await canManageDepartment(session.user.id, entityId);
        break;
      case 'ticket-manage':
        allowed = await canManageTicket(session.user.id, entityId);
        break;
      default:
        return NextResponse.json({ error: "Invalid permission type" }, { status: 400 })
    }

    return NextResponse.json({ allowed });
  } catch (error) {
    console.error("Error checking permissions:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}