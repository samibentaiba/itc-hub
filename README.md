This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Project Structure (Custom Additions)

This project uses a modular architecture for maintainability and scalability:

### `/src/services/`
- All API logic is centralized in service files (e.g., `userService.ts`, `teamService.ts`, `departmentService.ts`, `ticketService.ts`, `eventService.ts`, `fileService.ts`, `messageService.ts`, `notificationService.ts`).
- **How to use:** Import and call service functions in your components instead of using `fetch` directly.

### `/src/features/options/` and `/src/features/selects/`
- All select dropdown options (roles, statuses, types, etc.) are defined in `/options/`.
- Reusable select components (e.g., `RoleSelect`, `StatusSelect`, `TicketTypeSelect`, `DepartmentSelect`) are in `/selects/`.
- **How to use:** Import and use these select components in forms and UIs.

### `/src/components/common/`
- Common UI elements like `AvatarDisplay`, `RoleBadge`, and `StatusBadge` are here for consistent display of avatars, roles, and statuses.
- **How to use:** Use these components instead of duplicating badge/avatar logic.

### `/src/components/forms/`
- All major entity forms (user, team, department, ticket) are unified and reusable (`UserForm`, `TeamForm`, `DepartmentForm`, `TicketForm`).
- **How to use:** Use these forms in dialogs, modals, or pages for add/edit flows.

## How to Add New API Logic or Forms

1. **API Logic:**
   - Add a new function to the appropriate service file in `/src/services/`.
   - Import and use this function in your component.
2. **Select Options:**
   - Add new options to `/src/features/options/` and update or create a select component in `/src/features/selects/`.
3. **Badges/Avatars:**
   - Use or extend `RoleBadge`, `StatusBadge`, or `AvatarDisplay` in `/src/components/common/`.
4. **Forms:**
   - Use or extend the unified forms in `/src/components/forms/` for new entity types.

## Example Usage

```tsx
import { getUsers } from '@/services/userService';
import { RoleSelect } from '@/features/selects/RoleSelect';
import { UserForm } from '@/components/forms/UserForm';
import { RoleBadge } from '@/components/common/RoleBadge';
```

This ensures all business logic, UI, and options are consistent and maintainable across the app.
