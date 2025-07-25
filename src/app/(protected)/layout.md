# Protected Layout (`(protected)/layout.tsx`)

## Purpose
Wraps all protected pages under `/app/(protected)/` to enforce authentication and provide a consistent shell for authenticated users.

## UI/UX Intent
- **Minimal Wrapper:** Only renders children, assuming authentication is handled at a higher level or by individual pages.
- **Security:** Ensures only authenticated users can access child pages.

## Structure
- Simple React fragment wrapper: `<>{children}</>`

## Relationships
- Used by all protected routes (dashboard, admin, profile, etc.).
- Sits below the root layout, inheriting global providers and theme.

## Related Files
- `page.tsx` files in subdirectories for actual protected content. 