import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const events = await prisma.event.findMany({
    include: {
      organizer: true,
    },
  });
  return NextResponse.json(events);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const event = await prisma.event.create({
    data,
  });
  return NextResponse.json(event);
}
