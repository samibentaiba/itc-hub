import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
// ✅ Fix: params must be a Promise
interface RouteContext {
  params: Promise<{
    ticketId: string;
  }>;
}
export async function POST(req: NextRequest, context: RouteContext) {
  const params = await context.params;
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const content = formData.get("content") as string;
    const files = formData.getAll("files") as File[];

    if (!content && files.length === 0) {
      return NextResponse.json(
        { error: "Message content or file is required" },
        { status: 400 }
      );
    }

    const filesData = [];
    if (files.length > 0) {
      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        filesData.push({
          filename: file.name,
          mimetype: file.type,
          data: buffer,
          uploadedById: session.user.id,
          ticketId: params.ticketId,
        });
      }
    }

    const message = await prisma.message.create({
      data: {
        content: content || "",
        ticketId: params.ticketId,
        senderId: session.user.id,
        type: files.length > 0 ? "FILE" : "TEXT",
        files: { create: filesData },
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
