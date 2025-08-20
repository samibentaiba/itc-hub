// src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
import { sendVerificationEmail } from "@/lib/mailer";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
        // If user exists but email is not verified, resend verification email
        if (!existingUser.emailVerified) {
            const verificationToken = await prisma.emailVerificationToken.findFirst({
                where: { email: email.toLowerCase() },
            });

            if (verificationToken) {
                await prisma.emailVerificationToken.delete({
                    where: { id: verificationToken.id },
                });
            }

            const token = crypto.randomBytes(32).toString("hex");
            const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

            await prisma.emailVerificationToken.create({
                data: {
                    email: email.toLowerCase(),
                    token,
                    expiresAt,
                },
            });

            const verificationUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email/${token}`;
            await sendVerificationEmail(email.toLowerCase(), verificationUrl);

            return NextResponse.json({
                success: true,
                message: "A new verification email has been sent. Please check your inbox.",
            });
        }

      return NextResponse.json(
        { success: false, message: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase(),
        password: hashedPassword,
        role: Role.USER,
      },
    });

    // Generate verification token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.emailVerificationToken.create({
        data: {
            email: user.email,
            token,
            expiresAt,
        },
    });

    // Send verification email
    const verificationUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email/${token}`;
    await sendVerificationEmail(user.email, verificationUrl);

    // Remove password from response
    const { password: _var, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      message: "Account created successfully. Please check your email to verify your account.",
      user: userWithoutPassword,
    });

  } catch (error) {
    console.error("Registration error:", error);

    // Handle unique constraint errors
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        { success: false, message: "User with this email already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
