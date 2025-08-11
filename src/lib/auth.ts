import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  // Use the Prisma adapter to connect NextAuth with your database
  adapter: PrismaAdapter(prisma),

  // Configure the Credentials provider for email/password login
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      // The authorize function is where you verify the user's credentials
      async authorize(credentials) {
        // Check if email and password were provided
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Find the user in the database by their email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        // If no user is found, authentication fails
        if (!user) {
          return null;
        }

        // Compare the provided password with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        // If the passwords don't match, authentication fails
        if (!isPasswordValid) {
          return null;
        }

        // If authentication is successful, return the full user object
        // This object will be passed to the `jwt` callback
        return user;
      },
    }),
  ],

  // Use JSON Web Tokens (JWT) for session management
  session: {
    strategy: "jwt",
  },

  // Callbacks are used to control what happens during authentication events
  callbacks: {
    // The `jwt` callback is called whenever a JWT is created or updated
    async jwt({ token, user }) {
      // If the `user` object exists, it means this is the initial sign-in.
      // We add the custom properties from the user object to the token.
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.avatar = user.avatar;
        token.name = user.name;
        token.email = user.email;
      }
      // The token, now containing the user's data, is returned
      return token;
    },
    // The `session` callback is called whenever a session is accessed
    async session({ session, token }) {
      // We pass the data from the token to the session object's user property.
      // This makes the data available on the client side.
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.avatar = token.avatar;
        session.user.name = token.name;
        session.user.email = token.email;
      }
      // The updated session object is returned
      return session;
    },
  },

  // Define custom pages for sign-in
  pages: {
    signIn: "/login",
  },

  // The secret is used to encrypt the JWT
  secret: process.env.NEXTAUTH_SECRET,
};
