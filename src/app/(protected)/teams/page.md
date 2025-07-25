# Teams List Page (`(protected)/teams/page.tsx`)

## Purpose
Displays a list of all teams in the workspace for management and overview.

## UI/UX Intent
- **Grid/List:** Shows all teams with key info (name, members, etc.).
- **Actions:** Button to add a new team (opens a form or modal).
- **Header:** Contextual heading and description for the page.

## Structure
- Uses `DashboardShell` for consistent layout.
- `DashboardHeader` for page title and action button.
- `TeamsGrid` for the main team list.

## Relationships
- Sibling to other management pages (users, departments, tickets).
- May link to individual team pages (`/teams/[teamId]`).
- Consumes data from team services or API routes.

## Related Files
- `@/components/dashboard-shell`
- `@/components/dashboard-header`
- `@/components/teams-grid`
- `/api/teams/route.ts` (API logic) 