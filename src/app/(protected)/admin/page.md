# Admin Home Page (`(protected)/admin/page.tsx`)

## Purpose
Landing page for admin users, providing access to admin features and panels.

## UI/UX Intent
- **Admin Panel:** Shows admin controls, stats, and management tools.
- **Layout:** Uses `WorkspaceLayout` for consistency with the rest of the app.
- **Content:** Renders `AdminPanel` with links to user management, settings, etc.

## Structure
- `<WorkspaceLayout>` wraps the admin content.
- `<AdminPanel>` provides the main admin UI.

## Relationships
- Child of `(protected)/layout.tsx`.
- Sibling to other admin pages (users, settings, etc.).
- Consumes data from admin APIs and services.

## Related Files
- `@/components/workspace-layout`
- `@/components/admin-panel` 