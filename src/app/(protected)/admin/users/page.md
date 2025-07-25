# Admin Users Page (`(protected)/admin/users/page.tsx`)

## Purpose
Allows admin users to view, create, and manage users in the workspace.

## UI/UX Intent
- **User List:** Displays all users with name, email, and role.
- **User Creation:** Form to add new users with name, email, password, and role selection.
- **Feedback:** Shows success/error messages on user creation.
- **Access Control:** Only accessible to users with `ADMIN` role.

## Structure
- Uses React hooks for state and session management.
- Fetches users from `/api/admin/users`.
- Handles user creation via POST to `/api/admin/users`.

## Relationships
- Child of `admin/page.tsx` and `(protected)/layout.tsx`.
- Interacts with `/api/admin/users` API route.
- Relies on authentication/session from NextAuth.

## Related Files
- `@/services/userService.ts` (if used)
- `/api/admin/users/route.ts` (API logic)
- `@/components/users-table` (if used elsewhere) 