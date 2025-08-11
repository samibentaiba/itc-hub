// It's good practice to place this file in a `types` directory, e.g., `src/types/next-auth.d.ts`
import 'next-auth';
import 'next-auth/jwt';

/**
 * Extends the built-in `Session` to include custom properties like `id`, `role`, and `avatar`.
 * This makes the custom properties available on the `session.user` object throughout your app.
 */
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: string;
      avatar?: string | null;
    } & DefaultSession['user'];
  }

  /**
   * Extends the built-in `User` model.
   * This ensures the object returned from the `authorize` callback matches this shape.
   */
  interface User {
    role: string;
    avatar?: string | null;
  }
}

/**
 * Extends the built-in `JWT` to include your custom properties.
 * This allows you to pass the `id`, `role`, and `avatar` within the token.
 */
declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
    avatar?: string | null;
  }
}
