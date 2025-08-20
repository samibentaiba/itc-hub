// src/app/api/auth/verify-email/[token]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  const { token } = params;

  if (!token) {
    return NextResponse.redirect(new URL("/verification-result?success=false&message=Token is missing", request.url));
  }

  try {
    const verificationToken = await prisma.emailVerificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken) {
      return NextResponse.redirect(new URL("/verification-result?success=false&message=Invalid token", request.url));
    }

    if (new Date() > verificationToken.expiresAt) {
        await prisma.emailVerificationToken.delete({
            where: { id: verificationToken.id },
        });
      return NextResponse.redirect(new URL("/verification-result?success=false&message=Token has expired", request.url));
    }

    const user = await prisma.user.findUnique({
      where: { email: verificationToken.email },
    });

    if (!user) {
        // This should not happen, but as a safeguard
        await prisma.emailVerificationToken.delete({
            where: { id: verificationToken.id },
        });
        return NextResponse.redirect(new URL("/verification-result?success=false&message=User not found", request.url));
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: new Date() },
    });

    await prisma.emailVerificationToken.delete({
      where: { id: verificationToken.id },
    });

    // Redirect to a success page
    return NextResponse.redirect(new URL("/verification-result?success=true&message=Email verified successfully", request.url));

  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.redirect(new URL("/verification-result?success=false&message=An error occurred", request.url));
  }
}
