# Login Page (`login/page.tsx`)

## Purpose
Allows users to authenticate using email/password or Google OAuth.

## UI/UX Intent
- **Form:** Email and password fields with validation.
- **OAuth:** Button for Google sign-in.
- **Feedback:** Shows loading, error, and success states.
- **Redirect:** If already logged in, offers to continue to dashboard or log in as another user.

## Structure
- Uses React hooks for state and session management.
- Calls `signIn` from NextAuth for credentials or Google login.
- Redirects to `/users/profile` on success.

## Relationships
- Entry point for unauthenticated users.
- Sibling to registration (if present).
- Interacts with NextAuth API for authentication.

## Related Files
- `/api/auth/[...nextauth]/route.ts` (API logic)
- `@/services/userService.ts` (if used) 