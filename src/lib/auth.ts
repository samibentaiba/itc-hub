// src/lib/auth.ts
import { NextAuthOptions, User } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });
          if (!user) { return null; }
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isPasswordValid) { return null; }
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            avatar: user.avatar ?? undefined,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt", // Use JWT but with database lookups for fresh data
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      // If this is the initial sign-in, add user data to token
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.avatar = user.avatar;
      }

      // Always fetch fresh user data from database on every JWT callback
      // This ensures role changes are reflected immediately
      if (token.id) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
              avatar: true,
            },
          });

          if (dbUser) {
            // Update token with fresh database data
            token.id = dbUser.id;
            token.email = dbUser.email;
            token.name = dbUser.name;
            token.role = dbUser.role;
            token.avatar = dbUser.avatar;
          }
        } catch (error) {
          console.error("Error fetching fresh user data:", error);
        }
      }

      return token;
    },
    async session({ session, token }) {
      // Pass the fresh data from JWT token to session
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.avatar = token.avatar as string | null;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};