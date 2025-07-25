# Users List Page (`(protected)/users/page.tsx`)

## Purpose
Displays a list of all users in the workspace for management and overview.

## UI/UX Intent
- **Table/List:** Shows all users with key info (name, email, role, etc.).
- **Actions:** Button to add a new user (opens a form or modal).
- **Header:** Contextual heading and description for the page.

## Structure
- Uses `DashboardShell` for consistent layout.
- `DashboardHeader` for page title and action button.
- `UsersTable` for the main user list.

## Relationships
- Sibling to other management pages (teams, departments, tickets).
- May link to individual user profile pages (`/users/[userId]`).
- Consumes data from user services or API routes.

## Related Files
- `@/components/dashboard-shell`
- `@/components/dashboard-header`
- `@/components/users-table`
- `/api/users/route.ts` (API logic) 