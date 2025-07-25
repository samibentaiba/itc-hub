import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const tickets = await prisma.ticket.findMany({
    include: {
      team: true,
      department: true,
      assignee: true,
      createdBy: true,
      messages: true,
    },
  });
  return NextResponse.json(tickets);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const ticket = await prisma.ticket.create({
    data,
  });
  return NextResponse.json(ticket);
}
