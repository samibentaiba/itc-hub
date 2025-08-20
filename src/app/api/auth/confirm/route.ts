
// src/app/api/auth/reset/confirm/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || typeof token !== "string")
      return NextResponse.json({ error: "Token missing" }, { status: 400 });

    if (!password || typeof password !== "string" || password.length < 8)
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const rec = await prisma.passwordResetToken.findUnique({
      where: { token: tokenHash },
    });

    if (!rec || rec.expiresAt < new Date()) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }

    // Hash new password
    const hashed = await bcrypt.hash(password, 10);

    // Update user password
    await prisma.user.update({
      where: { email: rec.email },
      data: { password: hashed },
    });

    // Invalidate token (single-use)
    await prisma.passwordResetToken.delete({ where: { token: tokenHash } });

    return NextResponse.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("[reset/confirm] error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
