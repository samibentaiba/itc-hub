# Tickets List Page (`(protected)/tickets/page.tsx`)

## Purpose
Displays a list of all tickets (tasks/issues) for the workspace, with management actions.

## UI/UX Intent
- **Table/List:** Shows all tickets with key info (title, status, assignee, etc.).
- **Actions:** Button to add a new ticket (opens a form or modal).
- **Header:** Contextual heading and description for the page.

## Structure
- Uses `DashboardShell` for consistent layout.
- `DashboardHeader` for page title and action button.
- `TicketsTable` for the main ticket list.

## Relationships
- Sibling to other management pages (users, teams, departments).
- May link to individual ticket pages (`/tickets/[ticketId]`).
- Consumes data from ticket services or API routes.

## Related Files
- `@/components/dashboard-shell`
- `@/components/dashboard-header`
- `@/components/tickets-table`
- `/api/tickets/route.ts` (API logic) 