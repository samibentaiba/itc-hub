import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDepartments } from "@/server/admin/departments";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);

    // The service function now handles parsing and validation
    const departmentsData = await getDepartments({
      page: searchParams.get("page") ? Number(searchParams.get("page")) : undefined,
      limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined,
      search: searchParams.get("search") || undefined,
      status: searchParams.get("status") || undefined,
    });

    return NextResponse.json(departmentsData);
  } catch (error) {
    console.error("Error fetching departments:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// The POST function can be refactored similarly to use a `createDepartment` service function.
// For now, I will leave it as is to focus on the data fetching architecture.