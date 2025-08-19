
// src/app/api/auth/reset/request/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/mailer";
import crypto from "crypto";
import { headers } from "next/headers"; // named import
import { getAppBaseUrl } from "@/lib/secrets";

const EXP_MINUTES = 30;

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    const okResponse = NextResponse.json({ message: "If the email exists, a reset link was sent." });
    if (!user) return okResponse;

    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expiresAt = new Date(Date.now() + EXP_MINUTES * 60 * 1000);

    await prisma.passwordResetToken.deleteMany({
      where: { email, expiresAt: { lt: new Date() } },
    });

    await prisma.passwordResetToken.create({
      data: { token: tokenHash, email, expiresAt },
    });

    const hdrs = headers(); // ✅ sync call, no await
    const origin = hdrs.get("origin") || (await getAppBaseUrl());
    const resetUrl = `${origin.replace(/\/$/, "")}/reset-password?token=${rawToken}`;

    await sendPasswordResetEmail(email, resetUrl);

    return okResponse;
  } catch (e: unknown) {
    console.error("[reset/request] error:", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

