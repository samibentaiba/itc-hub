import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/files?id=...  (fetch file by id)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const file = await prisma.file.findUnique({ where: { id } });
  if (!file)
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  return new NextResponse(file.data, {
    status: 200,
    headers: {
      "Content-Type": file.mimetype,
      "Content-Disposition": `inline; filename=\"${file.filename}\"`,
    },
  });
}

// POST /api/files (multipart/form-data)
export async function POST(req: NextRequest) {
  // Parse multipart form
  const formData = await req.formData();
  const file = formData.get("file");
  const uploadedById = formData.get("uploadedById");
  const ticketId = formData.get("ticketId");
  const messageId = formData.get("messageId");
  if (!file || typeof file === "string" || !uploadedById) {
    return NextResponse.json(
      { error: "Missing file or uploadedById" },
      { status: 400 }
    );
  }
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const created = await prisma.file.create({
    data: {
      filename: file.name,
      mimetype: file.type,
      data: buffer,
      uploadedById: String(uploadedById),
      ticketId: ticketId ? String(ticketId) : undefined,
      messageId: messageId ? String(messageId) : undefined,
    },
  });
  return NextResponse.json({ id: created.id });
}
