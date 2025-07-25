# Profile Page (`(protected)/profile/page.tsx`)

## Purpose
Allows the logged-in user to view and edit their own profile, achievements, work, and memberships.

## UI/UX Intent
- **Editable Profile:** User can edit personal info, bio, social links, and avatar.
- **Tabs:** Overview, current work, achievements, teams/departments.
- **Security:** Change password dialog.
- **Stats:** Quick stats for projects, teams, mentorship, contributions.
- **Feedback:** Success/error toasts for actions.

## Structure
- Uses React hooks for state and form management.
- Tabs for different profile sections.
- Dialog for password change.
- Responsive layout for desktop/mobile.

## Relationships
- Linked from dashboard, sidebar, or user menu.
- Consumes data from user services or API routes.
- May update data in `/api/users/route.ts` or similar.

## Related Files
- `@/components/ui/card`, `@/components/ui/avatar`, `@/components/ui/dialog`, etc.
- `/api/users/route.ts` (API logic)
- `@/hooks/use-toast` (for feedback) 