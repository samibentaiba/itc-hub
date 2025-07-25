import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

// GET /api/users or /api/users?id=...
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (id) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        profile: { include: { achievements: true } },
        departments: true,
        teams: true,
      },
    });
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json(user);
  }
  // Return all users
  const users = await prisma.user.findMany({
    include: {
      profile: { include: { achievements: true } },
      departments: true,
      teams: true,
    },
  });
  return NextResponse.json(users);
}

// POST /api/users (admin creates a new user)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session?.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { name, email, password, role } = await req.json();
  if (!name || !email || !password || !role) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }
  const user = await prisma.user.create({
    data: { name, email, password, role },
  });
  return NextResponse.json({ id: user.id });
}

// PATCH /api/users (update profile fields)
export async function PATCH(req: NextRequest) {
  const data = await req.json();
  const { userId, realName, bio, profilePic } = data;
  if (!userId)
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  // Only allow updating profile fields (not teams/departments)
  const updated = await prisma.profile.update({
    where: { userId },
    data: {
      realName: realName || undefined,
      bio: bio || undefined,
      profilePic: profilePic ? Buffer.from(profilePic, "base64") : undefined,
    },
  });
  return NextResponse.json(updated);
}
