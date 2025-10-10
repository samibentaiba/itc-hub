
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: { ticketId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const content = formData.get("content") as string;
    const file = formData.get("file") as File | null;

    if (!content && !file) {
      return NextResponse.json(
        { error: "Message content or file is required" },
        { status: 400 }
      );
    }

    let fileData: {
      filename: string;
      mimetype: string;
      data: Buffer;
      uploadedById: string;
      ticketId: string;
    } | undefined;

    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      fileData = {
        filename: file.name,
        mimetype: file.type,
        data: buffer,
        uploadedById: session.user.id,
        ticketId: params.ticketId,
      };
    }

    const message = await prisma.message.create({
      data: {
        content: content || "",
        ticketId: params.ticketId,
        senderId: session.user.id,
        type: file ? "FILE" : "TEXT",
        files: fileData ? { create: fileData } : undefined,
      },
      include: {
        sender: true,
        files: true,
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("Error adding message:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
