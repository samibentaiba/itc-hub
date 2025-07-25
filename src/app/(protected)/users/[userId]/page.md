# User Profile Page (`(protected)/users/[userId]/page.tsx`)

## Purpose
Displays detailed information about a specific user, including profile, stats, teams, departments, and achievements.

## UI/UX Intent
- **Profile Card:** Shows avatar, name, contact info, and role.
- **Tabs:** Switch between current work, achievements, skills, and memberships.
- **Actions:** Message or connect with user.
- **Stats:** Quick stats for projects, teams, mentorship, code reviews.
- **Social Links:** GitHub, LinkedIn, Twitter, website, etc.

## Structure
- Uses React hooks to fetch and display user data.
- Tabs for different sections (work, achievements, skills, teams/departments).
- Responsive layout for desktop and mobile.

## Relationships
- Linked from users list and other team/department pages.
- May interact with messaging or connection features.
- Consumes data from user services or API routes.

## Related Files
- `@/components/ui/card`, `@/components/ui/badge`, `@/components/ui/avatar`, etc.
- `/api/users/route.ts` (API logic) 