import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const messages = await prisma.message.findMany({
    include: {
      ticket: true,
      sender: true,
    },
  });
  return NextResponse.json(messages);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const message = await prisma.message.create({
    data,
  });
  return NextResponse.json(message);
}
