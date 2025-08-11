// It's good practice to place this file in a `types` directory, e.g., `src/types/next-auth.d.ts`
import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Extends the built-in session to include custom properties like id, role, and avatar.
   */
  interface Session {
    user: {
      id: string;
      role?: string;
      avatar?: string | null;
    } & DefaultSession["user"];
  }

  /**
   * Extends the built-in User model to include role and avatar.
   */
  interface User extends DefaultUser {
    role?: string;
    avatar?: string | null;
  }
}

declare module "next-auth/jwt" {
  /**
   * Extends the built-in JWT to include id, role, and avatar.
   */
  interface JWT extends DefaultJWT {
    id?: string;
    role?: string;
    avatar?: string | null;
  }
}
