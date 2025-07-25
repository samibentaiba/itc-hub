import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const notifications = await prisma.notification.findMany({
    include: {
      user: true,
    },
  });
  return NextResponse.json(notifications);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const notification = await prisma.notification.create({
    data,
  });
  return NextResponse.json(notification);
}
