# Departments List Page (`(protected)/departments/page.tsx`)

## Purpose
Displays a list of all departments in the workspace for management and overview.

## UI/UX Intent
- **Grid/List:** Shows all departments with key info (name, members, etc.).
- **Actions:** Button to add a new department (opens a form or modal).
- **Header:** Contextual heading and description for the page.

## Structure
- Uses `DashboardShell` for consistent layout.
- `DashboardHeader` for page title and action button.
- `DepartmentsGrid` for the main department list.

## Relationships
- Sibling to other management pages (users, teams, tickets).
- May link to individual department pages (`/departments/[departmentId]`).
- Consumes data from department services or API routes.

## Related Files
- `@/components/dashboard-shell`
- `@/components/dashboard-header`
- `@/components/departments-grid`
- `/api/departments/route.ts` (API logic) 