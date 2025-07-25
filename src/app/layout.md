# Root App Layout (`layout.tsx`)

## Purpose
This is the root layout for the entire ITC Workspace application. It wraps all pages and layouts under `src/app/`.

## UI/UX Intent
- **Theme:** Provides a dark theme by default, with the ability to switch themes if needed.
- **Providers:** Wraps all children with global providers (e.g., context, theme, notifications).
- **Toaster:** Ensures toast notifications are available everywhere.
- **Font:** Uses the Inter font for a modern, readable look.

## Structure
- `<html lang="en">` with hydration warning suppression for Next.js.
- `<body>` applies the Inter font and wraps content in `ThemeProvider` and `ClientProviders`.
- All page content is rendered as `{children}`.

## Relationships
- All pages and layouts in the app inherit this layout.
- Provides the context and theme for all child components.
- Ensures consistent look and feel across the app.

## Related Files
- `globals.css` for global styles.
- `ClientProviders.tsx` for context providers.
- `@/components/theme-provider` for theme switching.
- `@/components/ui/toaster` for notifications. 