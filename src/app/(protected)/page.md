# Protected Home Page (`(protected)/page.tsx`)

## Purpose
This is the main dashboard page for authenticated users after login.

## UI/UX Intent
- **Dashboard:** Shows an overview of workspace activity, stats, and quick links.
- **Layout:** Uses `WorkspaceLayout` for a consistent dashboard shell.
- **Content:** Renders `DashboardView` with widgets, charts, or summaries.

## Structure
- `<WorkspaceLayout>` wraps the dashboard content.
- `<DashboardView>` provides the main dashboard UI.

## Relationships
- Child of `(protected)/layout.tsx`.
- Sibling to other protected pages (admin, profile, tickets, etc.).
- Consumes data from services and APIs for dashboard widgets.

## Related Files
- `@/components/workspace-layout`
- `@/components/dashboard-view` 