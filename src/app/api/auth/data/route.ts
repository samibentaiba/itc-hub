import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, getUser } from "@/lib/auth-helpers";

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthenticatedUser();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    } else {
      const user = await getUser(session.user.id);
      return NextResponse.json({
        userData: user,
      });
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
