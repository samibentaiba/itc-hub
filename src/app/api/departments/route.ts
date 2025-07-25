import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const departments = await prisma.department.findMany({
    include: {
      members: true,
      teams: true,
      tickets: true,
    },
  });
  return NextResponse.json(departments);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const department = await prisma.department.create({
    data,
  });
  return NextResponse.json(department);
} 