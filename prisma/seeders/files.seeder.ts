import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

export default async function runFilesSeeder(prisma: PrismaClient) {
  // Example: load a demo SVG from public
  const svgPath = path.join(__dirname, "../../public/file.svg");
  let svgData: Buffer | null = null;
  if (fs.existsSync(svgPath)) {
    svgData = fs.readFileSync(svgPath);
  }

  // Get a user, ticket, and message to link
  const user = await prisma.user.findFirst();
  const ticket = await prisma.ticket.findFirst();
  const message = await prisma.message.findFirst();

  if (user && svgData) {
    await prisma.file.create({
      data: {
        filename: "file.svg",
        mimetype: "image/svg+xml",
        data: svgData,
        uploadedById: user.id,
        ticketId: ticket?.id,
        messageId: message?.id,
      },
    });
  }

  // Add more demo files as needed
} 