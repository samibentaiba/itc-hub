# Team Details Page (`(protected)/teams/[teamId]/page.tsx`)

## Purpose
Displays the details and members of a specific team.

## UI/UX Intent
- **Team View:** Shows team info, members, and roles.
- **Layout:** Uses `WorkspaceLayout` for consistency.

## Structure
- Receives `teamId` as a prop.
- Renders `TeamView` for the team details.
- Wrapped in `WorkspaceLayout`.

## Relationships
- Linked from teams list and user profiles.
- Consumes data from team services or API routes.

## Related Files
- `@/components/workspace-layout`
- `@/components/team-view`
- `/api/teams/route.ts` (API logic) 