import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const teams = await prisma.team.findMany({
    include: {
      members: true,
      tickets: true,
      department: true,
    },
  });
  return NextResponse.json(teams);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const team = await prisma.team.create({
    data,
  });
  return NextResponse.json(team);
} 